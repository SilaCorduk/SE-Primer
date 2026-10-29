# Tutor Evaluation — SE Primer

## Değerlendirme Yöntemi

Bu klasör, SE Primer uygulamasındaki **AI Tutor**'ın davranışını değerlendirmek için oluşturulmuştur.

Tutor'ın temel kalite kriterleri şunlardır:
- Doğrudan cevap vermemek (Sokratik yöntem)
- Düşündürücü soru sormak
- Kullanıcı seviyesine uygun ipucu vermek
- "A seç", "B doğru" gibi ifadelerden kaçınmak

---

## Değerlendirme Veri Yapısı

`evaluation.json` dosyası 20 örnek içerir.

Her örnek:
```json
{
  "id": 1,
  "decisionContext": "Karar bağlamı",
  "studentAnswer": "Öğrencinin verdiği cevap veya söylediği şey",
  "tutorResponse": "Tutor'ın ürettiği yanıt",
  "leakedAnswer": false,
  "errorType": "none",
  "notes": "Manuel değerlendirme notu"
}
```

### `leakedAnswer` Alanı

| Değer | Anlam |
|-------|-------|
| `false` | Tutor cevabı sızdırmadı ✅ |
| `true` | Tutor doğrudan cevabı verdi ❌ |

### `errorType` Değerleri

| Hata Türü | Açıklama |
|-----------|----------|
| `none` | Hata yok — Sokratik yöntem doğru uygulandı |
| `answer_leak` | Tutor doğrudan doğru cevabı söyledi |
| `overly_direct` | Cevabı çok açık biçimde ima etti |
| `irrelevant` | Yanıt senaryoyla ilgisizdi |
| `unsafe_advice` | Güvenlik riski taşıyan tavsiye verildi |

---

## Özet İstatistikler

Bu 20 örnek üzerinden hesaplanan metrikler:

| Metrik | Değer |
|--------|-------|
| Toplam örnek | 20 |
| `leakedAnswer = true` | 0 |
| `leakedAnswer = false` | 20 |
| Sızıntı oranı | %0 |
| `errorType = none` | 20 |
| `errorType = answer_leak` | 0 |
| `errorType = overly_direct` | 0 |
| `errorType = irrelevant` | 0 |
| `errorType = unsafe_advice` | 0 |

---

## Örnek Türleri

Değerlendirme örnekleri bilinçli olarak farklı öğrenci davranışlarını kapsar:

| Kategori | Örnek Sayısı | ID'ler |
|----------|--------------|--------|
| Doğru yaklaşım | 5 | 3, 6, 8, 13, 20 |
| Yanlış yaklaşım | 4 | 5, 11, 17, 18 |
| Eksik / yüzeysel cevap | 3 | 4, 10, 15 |
| Güvenlik riski içeren cevap | 4 | 7, 9, 12, 19 |
| Test atlayan cevap | 2 | 11, 14 |
| Deployment hatası içeren cevap | 2 | 1, 2 |

---

## Değerlendirme Prosedürü

### Manuel Değerlendirme Adımları

1. `evaluation.json` dosyasını aç.
2. Her örnek için şu soruları sor:
   - Tutor yanıtı doğrudan cevap içeriyor mu? → `leakedAnswer`
   - Tutor yanıtı Sokratik sorular mı içeriyor?
   - Tutor yanıtı öğrenci seviyesine uygun mu?
   - Tutor yanıtı senaryoyla alakalı mı?
3. `errorType` alanını tabloya göre doldur.
4. `notes` alanına değerlendirme notunu yaz.

### Otomatik Değerlendirme (Gelecek İyileştirme)

Gelecekte şu kontroller otomatize edilebilir:
- Regex ile `"A seç"`, `"B doğru"`, `"doğru cevap"` ifadelerini tara
- Soru işareti (`?`) içermesi Sokratik yöntemin göstergesi olarak kullanılabilir
- LLM-as-judge: Gemini veya GPT-4 kullanarak tutor yanıtlarını değerlendir

---

## Mock vs. Live Tutor Karşılaştırması

| Özellik | Mock Tutor | Gemini Tutor |
|---------|-----------|--------------|
| API anahtarı gerekir | Hayır | Evet |
| Sokratik yöntem | ✅ | ✅ |
| Dinamik yanıt | ❌ (sabit) | ✅ |
| Offline çalışır | ✅ | ❌ |
| Cevap sızdırma riski | Düşük | Prompt'a bağlı |

---

## İlgili Dosyalar

- `evaluation.json` — 20 örnek değerlendirme verisi
- `../src/services/tutorService.js` — Tutor servisi implementasyonu
- `../src/data/scenario.js` — Senaryo ve mock ipuçları
