/**
 * scenario.js
 * All scenario data: decisions, options, feedback, finals.
 * Kept outside components for testability and separation of concerns.
 */

export const SCENARIO_INTRO = {
  title: 'Olay #2024-1847',
  time: 'Çarşamba, 08:14',
  subtitle: 'Medikal Yazılım Sistemleri — Nöbet Mühendisi',
  description: `Sabah 08:14. Medikal Yazılım Sistemleri ekibindeki ilk gece nöbetinin son saatindesin.
Tam vardiyayı devredecekken telefon çalıyor.

Operasyon merkezi: "Randevu sistemi çöktü. v3.2.1 güncellemesi gece 03:00'te canlıya alındı.
O andan beri hasta kayıtlarına erişilemiyor. Şu an 300'den fazla hasta işlem bekliyor,
poliklinikler açılmaya başlıyor."

Hastanenin randevu ve hasta kayıt sistemi — HastaBakım HMS — yanıt vermiyor.
Servis monitöründe 503 hatası var. Veritabanı bağlantı havuzu tükenmiş.

Soruşturmaya başlıyorsun...`,
  systemStatus: {
    hms: 'ÇÖKMÜŞ',
    db: 'BAĞLANTI HAVUZU TÜKENMÜŞ',
    api: '503 SERVICE UNAVAILABLE',
    patients: '312 hasta işlem bekliyor',
  },
}

export const DECISIONS = [
  {
    id: 'decision-1',
    number: 1,
    total: 3,
    topic: 'Deployment / Mimari',
    title: 'Sistem Geri Kazanımı',
    situation: `Logları inceliyorsun. v3.2.1 güncellemesi üç büyük değişiklik getirmiş:
1. Veritabanı connection pool boyutu 50'den 200'e çıkarılmış
2. Hasta randevu tablosuna yeni bir "insurance_code" sütunu eklenmiş (migration script ile)
3. Yeni bir önbellekleme katmanı (Redis) eklenmiş

Ancak Redis sunucusu production'da başlamamış — uygulama Redis'e bağlanamayınca
connection timeout bekliyor, bu da DB bağlantı havuzunu tüketiyor.

Servis müdürü hat üzerinde: "Ne yapacaksın? Her dakika kayıp."`,
    options: [
      {
        id: 'A',
        label: 'A — Hızlı Rollback',
        description:
          "v3.2.1'i geri al, sistemi v3.2.0'a döndür. Hızlıca çöz, hasta trafiğini kurtar.",
        icon: '⏮',
      },
      {
        id: 'B',
        label: 'B — Yerinde Düzeltme',
        description:
          "Redis'i düzelt veya Redis bağımlılığını bypass ederek v3.2.1'i ayağa kaldır. Rollback yapmadan sorunu çöz.",
        icon: '🔧',
      },
    ],
    tutorHints: {
      beginner: `Bir şeyi geri almadan önce o şeyin geri alınabilir olup olmadığını sormak iyi bir mühendislik alışkanlığıdır.
Örneğin: Veritabanı şemasına yeni bir sütun eklendiyse ve bu sütuna veri yazıldıysa, eski koda döndüğünde bu veri ne olur?
Rollback ile birlikte veritabanı migration'ı da geri alabilir misin?`,
      intermediate: `v3.2.1 bir veritabanı migration çalıştırdı. Rollback yaparsanız uygulama kodu v3.2.0'a döner, ama veritabanı şeması yeni haliyle kalabilir. Bu uyumsuzluk ne anlama gelir?`,
      experienced: `Migration idempotency ve "backward-compatible migration" kavramını düşün. Bu deployment'ta hangi strateji izlendi — blue-green mi, rolling update mı? Bu seçim rollback kararını nasıl etkiler?`,
    },
    feedback: {
      A: {
        what: `v3.2.0'a rollback başlatıldı. Uygulama sunucuları 4 dakika içinde eski sürüme döndü ve sisteme yeniden erişim sağlandı. Hasta trafiği normalize oldu.

Ancak — veritabanındaki "insurance_code" sütunu hala duruyor. v3.2.0 bu sütunu bilmiyor; bazı ORM sorguları beklenmedik şekilde davranabilir. Şimdilik sistem çalışıyor, ama şema uyumsuzluğu bir "technical debt" bıraktı.`,
        why: `Rollback, veritabanı migration'larını otomatik geri almaz. Uygulama kodunu eski sürüme döndürmek, veritabanı şemasını senkronize etmez. Bu, "code rollback ≠ schema rollback" sorunudur.

Additive migration (sütun ekleme) genellikle eski kod tarafından tolere edilir; ancak migration geri alınmadığı için yeni sürüm tekrar deploy edildiğinde dikkat gerekecek. Bu durumu "dark schema" riski olarak belgelemelisin.`,
        risk: 'medium',
        label: 'Sistem Kurtarıldı — Şema Riski Var',
      },
      B: {
        what: `Redis sunucusu başlatıldı ve konfigürasyon doğrulandı. v3.2.1 Redis'e bağlandı, connection pool normale döndü. Sistem 9 dakika içinde tam kapasitede çalışmaya başladı. Hiçbir veri kaybı yaşanmadı.`,
        why: `Root cause (Redis başlamamış) direkt olarak çözüldü. Rollback yapılmadığı için veritabanı şeması ve uygulama kodu tutarlı kaldı. Bu yaklaşım "fix-forward" (ileriye doğru düzeltme) olarak bilinir — eğer root cause net ve hızlıca çözülebilirse rollback'ten daha temiz bir çözümdür.

Ancak bu karar daha fazla analiz ve güven gerektirdi. Yanlış teşhis yapılsaydı daha fazla zaman kaybedilebilirdi.`,
        risk: 'low',
        label: 'Fix-Forward — Temiz Çözüm',
      },
    },
  },
  {
    id: 'decision-2',
    number: 2,
    total: 3,
    topic: 'Test Stratejisi',
    title: 'Doğrulama Süreci',
    situation: `Sistem tekrar ayakta. Ama ekip liderinden mesaj geliyor:

"Tamam sistem çalışıyor gibi görünüyor ama bugün sabah 09:30'da Kardiyoloji
polikliniklerinde hasta kabulü başlıyor. Sistem gerçekten hazır mı? Nasıl doğruluyoruz?"

Elinde test ortamı var ama tam production mirror'ı değil — test DB'si production'ın
%30 büyüklüğünde. Ayrıca otomatik regresyon test süiti var ama son güncellemeyle
bazı testler güncellenmemiş.

Ne yapıyorsun?`,
    options: [
      {
        id: 'A',
        label: 'A — Smoke Test + Manuel Doğrulama',
        description:
          'Kritik iş akışlarını (randevu alma, hasta kaydı görüntüleme, reçete yazma) manuel olarak test et. Hızlı ama kapsamlı değil.',
        icon: '🧪',
      },
      {
        id: 'B',
        label: 'B — Otomatik Regresyon + Kademeli Açılış',
        description:
          'Mevcut otomatik test süitini çalıştır. Eksik testleri not al. Sistemi önce tek bir polikliniğe aç, 15 dakika izle, sonra genele yay.',
        icon: '🤖',
      },
    ],
    tutorHints: {
      beginner: `Test yaparken şunu düşün: "Bu test ne kadar güven sağlıyor?" Bir sistemi 10 dakika manuel test etmek ile 300 otomatik testi çalıştırmak arasındaki fark nedir? Peki hiç test etmeden açmakla küçük bir kullanıcı grubuyla açmak arasındaki fark?`,
      intermediate: `"Smoke test" ile "regression test" arasındaki farka bak. Kademeli açılış (canary deployment) bu senaryoda ne sağlar? Eksik otomatik testlerin sisteme olan güvenini nasıl etkiler?`,
      experienced: `Test coverage gap'i ile deployment risk'i nasıl dengeliyorsun? Canary ve automated regression kombinasyonunun "shift-left testing" ilkesiyle ilişkisi nedir? Bu olayın post-mortem'ında test stratejisi hakkında ne yazardın?`,
    },
    feedback: {
      A: {
        what: `Kritik iş akışları manuel olarak test edildi. 09:30'da tüm poliklinikler açıldı.
İlk bir saatte sistem stabil göründü. Ancak öğleden sonra — manuel testte yakalanmayan bir edge case — eski randevuların tekrar görüntülenmesi sırasında NullPointerException başladı.
Bu, migration öncesi veri formatıyla ilgili bir uyumsuzluktu.`,
        why: `Manuel smoke test hızlıdır ama kapsam sınırlıdır — özellikle migration sonrası veri uyumsuzluklarını bulmak için iyi değildir. Sistemi tek seferde tam kapasiteyle açmak, olası hataların tüm kullanıcıları etkilemesi riskini taşır.
"Test in production" kaçınılmaz oldu ama kontrollü değildi.`,
        risk: 'medium',
        label: 'Açıldı — Edge Case Kaçtı',
      },
      B: {
        what: `Otomatik test süiti 6 dakikada tamamlandı: 847 test geçti, 12 test başarısız (eski randevu görüntüleme ile ilgili — bunlar known issue olarak işaretlendi). Sistem önce Kardiyoloji polikliniğine açıldı. 15 dakika boyunca log monitörü izlendi, kritik hata gözlemlenmedi. 09:45'te tüm poliklinikler açıldı.`,
        why: `Otomatik regresyon testleri, manuel testin kaçıracağı edge case'leri yakalar. Kademeli açılış (canary deployment prensibi), olası bir hatanın tüm kullanıcıları etkilemesini önler. Eksik testleri not almak, teknik borcu görünür kılar ve sonraki sprint'te ele alınmasını sağlar. Bu yaklaşım "confidence through evidence" prensibini uygular.`,
        risk: 'low',
        label: 'Kontrollü Açılış — Güvenli',
      },
    },
  },
  {
    id: 'decision-3',
    number: 3,
    total: 3,
    topic: 'KVKK / Log Güvenliği',
    title: 'Veri Güvenliği Kararı',
    situation: `Sistem stabil çalışıyor. Olay inceleme süreci başladı. Yazılım güvenlik sorumlunuzdan mesaj:

"Kriz sırasındaki hata loglarına baktım. Uygulama loglarında sorun var."

Logları açıyorsun ve şunu görüyorsun:

[ERROR 08:14:33] DB timeout for patient_id=P-48291, name='Ayse Y.',
appointment_date=2024-03-15, doctor_id=D-112

[ERROR 08:14:41] Connection pool exhausted. Retry for patient_id=P-48299,
insurance_no=SGK-5839182, diagnosis_code=J18.1

Loglar uygulama sunucusunda tutuluyor ve Slack'teki #ops-alerts kanalına
stream ediliyor. Bu kanalda 40 kişi var — çoğu bu verilere erişim yetkisi yok.

Ne yapıyorsun?`,
    options: [
      {
        id: 'A',
        label: 'A — Acil Maskeleme + Temizlik',
        description:
          "Slack kanalından ilgili log mesajlarını sil. Log konfigürasyonunu güncelle: kişisel veriler maskelenerek (örn. patient_id=P-***91) loglanacak şekilde ayarla. Güvenlik sorumlusuna ve DPO'ya bildir.",
        icon: '🔒',
      },
      {
        id: 'B',
        label: 'B — Olayı Belgele, Çözümü Sonraya Bırak',
        description:
          "Logları şimdilik olduğu gibi bırak — sistemi istikrara kavuşturmak öncelik. Log maskeleme için bir ticket aç, sprint'e al. Slack kanalını kapat.",
        icon: '📋',
      },
    ],
    tutorHints: {
      beginner: `Loglarda kişisel sağlık verisi (hasta adı, sigorta numarası, tanı kodu) görünüyor. Bu verilerin yetkisiz kişilerin erişebildiği bir kanalda bulunması ne anlama gelir? KVKK'da "kişisel sağlık verisi" nasıl sınıflandırılır?`,
      intermediate: `Slack kanalındaki 40 kişiden kaçı bu verilere erişim yetkisine sahip? Bu durum KVKK Madde 12 kapsamında "veri ihlali" sayılır mı? Bildirimi ne zaman yapmalısın — hemen mi, yoksa çözdükten sonra mı?`,
      experienced: `KVKK Madde 12 ve ilgili GDPR Article 33 kapsamındaki ihlal bildirimi sürecini değerlendir. "Privacy by design" ilkesi bu log konfigürasyonunun baştan nasıl yapılandırılması gerektiğini nasıl şekillendirir? Data minimization prensibine göre hata loglarında hangi alanlar yer alabilir, hangiler yer alamaz?`,
    },
    feedback: {
      A: {
        what: `Slack kanalındaki log mesajları 12 dakika içinde silindi. Log konfigürasyonu güncellendi — artık hasta ID'leri kısmi maskeleme ile (P-***91) loglanıyor, ad, sigorta numarası ve tanı kodları hiç loglanmıyor. Güvenlik sorumlusu ve DPO bildirildi. DPO, kanalda bulunma süresini ve erişen kişileri belgeleyerek 72 saat içinde KVKK'ya değerlendirme bildirimi yapmayı planladı.`,
        why: `Kişisel sağlık verisi (özel nitelikli kişisel veri — KVKK Madde 6) izinsiz paylaşıldığında bu bir veri ihlalidir. Hızlı müdahale, ihlalin boyutunu küçültür. Log maskelemesi "data minimization" prensibini uygular — bir hatayı debug etmek için tam hasta adına veya sigorta numarasına ihtiyaç yoktur; ID'nin son 2 hanesi yeterlidir. DPO bildirimi hem yasal zorunluluk hem de doğru mühendislik pratiğidir.`,
        risk: 'low',
        label: 'Veri İhlali Kontrol Altında',
      },
      B: {
        what: `Sistem stabil hale geldi. Log maskeleme ticket'ı açıldı ama sprint planlama toplantısına kadar önceliklendirilmedi — 6 gün. Bu 6 gün boyunca hasta adları, sigorta numaraları ve tanı kodları Slack #ops-alerts kanalında akmaya devam etti. 40 kişi bu verilere erişmeye devam etti.`,
        why: `Teknik borcu "sonraya bırakmak" bazen makul olabilir — ama aktif veri ihlali devam ettiğinde değil. KVKK Madde 12'ye göre veri ihlali tespit edildiğinde DPO bilgilendirilmeli ve 72 saat içinde değerlendirme yapılmalıdır. Geciktirme, ihlalin boyutunu artırır ve yasal yaptırım riskini yükseltir. "Önce sistemi kurtaralım" düşüncesi doğru olabilir — ama log güvenliği de aynı anda ele alınabilecek bir aksiyon.`,
        risk: 'high',
        label: 'KVKK İhlali Devam Etti',
      },
    },
  },
]

/**
 * Determine the final outcome based on decisions made.
 * decisions: Array of { decisionId, choice } objects
 */
export function computeOutcome(decisions) {
  const d2 = decisions.find((d) => d.decisionId === 'decision-2')?.choice
  const d3 = decisions.find((d) => d.decisionId === 'decision-3')?.choice

  const d3Risk = d3 === 'B'
  const d2Risk = d2 === 'A'

  if (!d3Risk && !d2Risk) {
    return 'FINAL_A'
  } else if (d3Risk) {
    return 'FINAL_B'
  } else {
    return 'FINAL_C'
  }
}

export const FINALS = {
  FINAL_A: {
    id: 'FINAL_A',
    title: 'Sistem Güvenle Ayağa Kalktı',
    subtitle: 'İyi Mühendislik Pratiği',
    overallRisk: 'good',
    badge: 'Başarılı Müdahale',
    systemStatus: 'Tüm sistemler stabil. Hasta trafiği normal.',
    securityStatus: 'Veri güvenliği sağlandı. KVKK uyumu korundu.',
    summary: `Bugün gerçek bir mühendislik krizini yönettiniz. Sistem 45 dakikadan az sürede kurtarıldı,
veri güvenliği ihlali önlendi ve kontrollü bir deployment süreci izlendi.
Post-mortem'da bu kriz, incident response süreçlerinin olgunluğunu kanıtlayan bir örnek olarak belgelenecek.`,
    lessons: [
      'Rollback kararı vermeden önce migration durumunu doğrulamak kritiktir.',
      "Otomatik testler + kademeli açılış, güvenli deployment'ın temel taşlarıdır.",
      'Kişisel sağlık verisi loglarında asla plain-text olmamalı — privacy by design.',
      'Veri ihlali şüphesinde ilk aksiyon geciktirme değil, DPO bildirimidir.',
    ],
  },
  FINAL_B: {
    id: 'FINAL_B',
    title: 'Sistem Çalışıyor — Güvenlik İhlali Var',
    subtitle: 'KVKK Riski Gerçekleşti',
    overallRisk: 'bad',
    badge: 'Kritik Güvenlik Açığı',
    systemStatus: 'Sistem çalışıyor. Hasta hizmetleri sürdürülüyor.',
    securityStatus: 'KVKK ihlali devam etti. DPO bildirimi gecikti. Yasal risk yüksek.',
    summary: `Sistem kurtarıldı ama veri güvenliği cephesinde kritik bir hata yapıldı.
Kişisel sağlık verilerinin Slack kanalında günlerce akması, KVKK kapsamında ciddi bir ihlal oluşturdu.
Bu tür kararlar, bir şirketin KVKK cezası almasına neden olabilir.`,
    lessons: [
      'Aktif veri ihlali teknik borç değil, acil müdahale gerektiren bir güvenlik olayıdır.',
      'Log güvenliği bir nice-to-have değil, temel gereksinimdir.',
      'KVKK Madde 12: İhlal tespitinden itibaren 72 saat içinde DPO bilgilendirilmeli.',
      'Kriz anında güvenlik kararlarını ertelemek, riskin boyutunu büyütür.',
    ],
  },
  FINAL_C: {
    id: 'FINAL_C',
    title: 'Sistem Stabil — Teknik Borç Birikti',
    subtitle: 'Kısmi Risk Yönetimi',
    overallRisk: 'warning',
    badge: 'İyileştirme Gerekli',
    systemStatus: 'Sistem çalışıyor. Edge case hatalar gözlemlendi.',
    securityStatus: 'Veri güvenliği korundu. Test kapsamı genişletilmeli.',
    summary: `Doğru güvenlik kararını verdiniz — bu önemli. Ancak test stratejisinde boşluklar kaldı.
Manuel smoke test bazı edge case'leri gözden kaçırdı. Sistem çalışıyor ancak teknik borç birikti.
Sonraki sprint'te test süiti güçlendirilmeli.`,
    lessons: [
      'Veri güvenliği doğru yönetildi — bu en kritik karardı.',
      'Manuel test, regression testinin yerine geçemez — her ikisi de değerlidir.',
      'Kademeli açılış (canary deployment) yüksek riskli güncellemelerde iyi pratiktir.',
      'Teknik borcu görünür kılmak (ticket açmak) önemlidir — ama güvenlik borcu olmaz.',
    ],
  },
}
