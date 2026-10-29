# SE Primer

> **Yazılım Mühendisliği Simülasyon Uygulaması**  
> YZM301 Dersi — İnteraktif Eğitim Projesi

---

## Proje Hakkında

SE Primer, üniversite düzeyindeki yazılım mühendisliği öğrencilerinin teknik kavramları **kararlarının sonuçlarını deneyimleyerek** öğrenmesini amaçlayan interaktif bir eğitim uygulamasıdır.

Kullanıcı, çökmüş bir hastane randevu sistemini (HastaBakım HMS) kurtarmaya çalışan nöbetçi bir yazılım mühendisi rolüne girer. Üç kritik karar noktasında — deployment stratejisi, test yaklaşımı ve KVKK/log güvenliği — seçimler yapar. Her karardan sonra uygulama sonucu açıklar ve yazılım mühendisliği açısından neden önemli olduğunu öğretir.

**Bu, klasik bir quiz uygulaması değildir.**

---

## Özellikler

- 🎭 **Dallanan Senaryo** — 3 karar, 2+ farklı final, 8 olası yol
- 👤 **Kişiselleştirme** — Seviye (Yeni/Orta/Deneyimli), Rol, Hedef seçimi
- 🤖 **AI Tutor** — Sokratik yöntemle ipuçları (Gemini API veya Mock)
- ⏱️ **Baskı Sistemi** — Deneyimli kullanıcılar için 60 saniyelik karar timer'ı
- 📊 **Karar Analizi** — Her karar için "Ne Oldu? / Neden Oldu?" açıklamaları
- 🔒 **KVKK Senaryosu** — Log güvenliği ve veri ihlali gerçekçi bağlamda ele alınıyor
- 📱 **Mobil-First** — Telefon ekranı öncelikli, desktop'ta da düzgün görünüm
- 🧪 **Cypress E2E** — 8 temel test senaryosu

---

## Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| React 18 | UI framework |
| Vite 5 | Build tool ve dev server |
| JavaScript (ES6+) | Uygulama dili |
| CSS (custom properties) | Stil sistemi |
| Cypress 13 | E2E test framework |
| Gemini API (opsiyonel) | AI Tutor entegrasyonu |

---

## Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+

### Adımlar

```bash
# Proje dizinine gir
cd SE-Primer

# Bağımlılıkları yükle
npm install

# (Opsiyonel) Gemini API anahtarı için .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle: VITE_GEMINI_API_KEY=your_key_here
```

> **Not**: `.env` dosyası olmadan uygulama **Mock Tutor** ile tamamen çalışır.

---

## Çalıştırma

```bash
# Development server başlat
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Build önizleme
npm run preview
```

---

## Cypress Testleri

```bash
# Önce dev server'ı başlat:
npm run dev

# Ayrı bir terminalde:

# Interaktif mod (Cypress UI)
npx cypress open

# Headless mod (CI)
npx cypress run

# veya
npm test
```

### Test Listesi

| Test | Açıklama |
|------|----------|
| Test 1 | Yeni başlayan kullanıcı uygulamayı başlatabiliyor mu? |
| Test 2 | Kullanıcı 3 kararın tamamını verebiliyor mu? |
| Test 3 | Karar sonrası "Ne Oldu?" ve "Neden Oldu?" geliyor mu? |
| Test 4 | İyi final (FINAL_A) görüntüleniyor mu? |
| Test 5 | KVKK ihlali finali (FINAL_B) görüntüleniyor mu? |
| Test 6 | Tutor doğrudan cevap söylemiyor mu? |
| Test 7 | Deneyimli kullanıcıda timer görünüyor mu? |
| Test 8 | Tekrar Oyna başlangıca döndürüyor mu? |

---

## AI Tutor Yapısı

Tutor, **Sokratik yöntem** ile çalışır:
- Doğrudan cevap vermez
- Düşündürücü sorular sorar
- Kullanıcının kendi sonucuna ulaşmasına yardım eder

### Entegrasyon Seçenekleri

**1. Mock Tutor (varsayılan)**  
API anahtarı olmadan çalışır. `src/data/scenario.js` içindeki hazır Sokratik sorular kullanılır.

**2. Gemini API (opsiyonel)**  
```
# .env dosyasına ekle:
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

`src/services/tutorService.js` dosyası:
- API anahtarı varsa → Gemini `gemini-2.0-flash` modeli
- API anahtarı yoksa → Mock tutor'a otomatik fallback
- API hatasında → Mock tutor'a graceful fallback

> ⚠️ API anahtarı asla kod içine yazılmaz — her zaman environment variable kullanılır.

---

## Proje Yapısı

```
SE-Primer/
│
├── src/
│   ├── components/
│   │   ├── Onboarding.jsx       # Giriş / profil ekranı
│   │   ├── Onboarding.css
│   │   ├── Scenario.jsx         # Senaryo state machine
│   │   ├── Scenario.css
│   │   ├── DecisionCard.jsx     # Karar seçenekleri
│   │   ├── DecisionCard.css
│   │   ├── FeedbackPanel.jsx    # Ne Oldu / Neden Oldu
│   │   ├── FeedbackPanel.css
│   │   ├── TutorPanel.jsx       # AI Tutor accordion
│   │   ├── TutorPanel.css
│   │   ├── Timer.jsx            # Circular countdown timer
│   │   ├── Timer.css
│   │   ├── FinalScreen.jsx      # Final ekranı
│   │   └── FinalScreen.css
│   │
│   ├── data/
│   │   └── scenario.js          # Tüm senaryo verisi
│   │
│   ├── services/
│   │   └── tutorService.js      # Gemini/Mock tutor servisi
│   │
│   ├── styles/
│   │   └── global.css           # Global stil sistemi
│   │
│   ├── App.jsx                  # Root component, routing
│   └── main.jsx                 # React DOM mount
│
├── cypress/
│   └── e2e/
│       └── se_primer.cy.js      # 8 E2E test
│
├── tutor_eval/
│   ├── evaluation.json          # 20 öğrenci cevabı + tutor değerlendirmesi
│   └── README.md                # Değerlendirme yöntemi
│
├── public/
│
├── spec.md                      # Ürün spesifikasyonu
├── DESIGN.md                    # Tasarım kararları
├── README.md                    # Bu dosya
├── package.json
├── vite.config.js
├── cypress.config.js
└── .env.example
```

---

## Tutor Evaluation

`tutor_eval/evaluation.json` dosyası 20 farklı öğrenci cevabı ve karşılık tutor yanıtı içerir.

| Kategori | Sayı |
|----------|------|
| Doğru yaklaşım | 5 |
| Yanlış yaklaşım | 4 |
| Eksik / yüzeysel cevap | 3 |
| Güvenlik riski içeren cevap | 4 |
| Test atlayan cevap | 2 |
| Deployment hatası içeren cevap | 2 |

**Özet**: 20 örnekte `leakedAnswer = false` (sızıntı yok), `errorType = none`.

Detaylı değerlendirme yöntemi için: [`tutor_eval/README.md`](./tutor_eval/README.md)

---

## Ürün Kararları

### Yapılmayanlar ve Nedenleri

1. **Kullanıcı hesabı / giriş sistemi yapılmadı** — Bir haftalık MVP kapsamında kimlik doğrulama, ürünün öğrenme hedefi için gerekli görülmedi; oturum bilgisi local state'te tutuldu.

2. **İkinci senaryo yapılmadı** — Ödev kapsamı tek sağlık senaryosu ile sınırlandırıldı; ikinci senaryo eklemek yerine mevcut senaryonun derinliğine ve öğreticiliğine odaklanıldı.

3. **Native Android/iOS uygulaması yapılmadı** — Teslim gereksinimi mobil uyumlu web uygulaması olduğu için responsive web tercih edildi; ayrıca web versiyonu kurulum gerektirmeden erişim sağlar.

---

## Senaryo Özeti

| Karar | Konu | İki Seçenek |
|-------|------|-------------|
| Karar 1 | Deployment / Mimari | A: Hızlı Rollback / B: Yerinde Fix |
| Karar 2 | Test Stratejisi | A: Manuel Smoke Test / B: Otomatik + Kademeli |
| Karar 3 | KVKK / Log Güvenliği | A: Maskeleme + DPO / B: Erteleme |

**Finaller**:
- `FINAL_A`: Sistem güvenle kurtarıldı ✅
- `FINAL_B`: KVKK ihlali oluştu ❌
- `FINAL_C`: Sistem çalışıyor, teknik borç birikti 🟡

---

## Lisans

MIT — YZM301 Eğitim Projesi
