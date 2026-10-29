# SE Primer — Design Document

## Tasarım Amacı

SE Primer'in tasarım hedefi, öğrenciye bir **incident response dashboard** hissiyatı vermektir.
Uygulama bir oyun değil; gerçek bir mühendislik ortamını simüle eder.
Tasarım dili:
- Profesyonel ama öğrenci projesi olarak uygulanabilir
- Karanlık tema (dark mode) — prodüksiyon dashboard'larına benzer
- Minimal ve odaklı — gereksiz UI elemanları yok
- Her ekran bir "görev" sunar

---

## Mobil-First Yaklaşım

Tasarım stratejisi:

1. **360px viewport** esas alınarak tasarlandı
2. **Container max-width**: 480px (mobil), 680px (tablet+)
3. **Tek sütun layout** — mobilde yatay kaydırma yok
4. **Touch target minimum 44px** — erişilebilirlik standartı
5. **Büyük, net butonlar** — küçük ekranda hata payı az olmalı
6. Desktop'ta ortada dar bir sütun, iki yanda boşluk

---

## Kullanılan Ekranlar

### Ekran 1 — Onboarding (Giriş / Profil)

**Amaç**: Kullanıcı profilini oluşturmak.

**Elementler**:
- App logo + başlık (SE Primer)
- Senaryo teaserı (kırmızı uyarı kartı)
- 3 seçim bölümü: Seviye, Rol, Hedef
- "Senaryoyu Başlat" CTA butonu

**Davranış**:
- Tüm seçimler yapılmadan CTA disabled
- Seçimler animasyonlu (hover + selected state)

<!-- STITCH SCREENSHOT PLACEHOLDER -->
<!-- Buraya Google Stitch'ten üretilen Onboarding ekran görüntüsü eklenebilir -->
<!-- Örnek: ![Onboarding Screen](./stitch-designs/onboarding.png) -->

---

### Ekran 2 — Senaryo / Karar

**Amaç**: Senaryoyu anlatmak ve kararı almak.

**Sub-states**:
1. **Intro**: Olay bilgisi, sistem durumu, "Olayı İncele" butonu
2. **Decision**: Karar numarası, progress bar, durum anlatımı, 2 seçenek
3. **Feedback**: "Ne Oldu?", "Neden Oldu?", risk göstergesi, "Sonraki Karar" butonu

**Elementler**:
- Topbar: App adı + incident ID + status badge
- Progress bar (karar x/3)
- Önceki kararların özet listesi
- DecisionCard: Durum metni + 2 seçenek butonu
- Timer (yalnızca deneyimli kullanıcı)
- AI Tutor accordion

<!-- STITCH SCREENSHOT PLACEHOLDER -->
<!-- Buraya Google Stitch'ten üretilen Scenario/Decision ekran görüntüsü eklenebilir -->
<!-- Örnek: ![Decision Screen](./stitch-designs/decision.png) -->

---

### Ekran 3 — Final

**Amaç**: Sonucu özetlemek ve dersleri vermek.

**Elementler**:
- Sonuç kartı (yeşil/sarı/kırmızı tema)
- Sistem durumu + veri güvenliği durumu
- Karar özeti (3 karar + risk etiketi)
- Kazanılan dersler listesi
- Kişisel not (rol + seviye bilgisi)
- "Tekrar Oyna" butonu

<!-- STITCH SCREENSHOT PLACEHOLDER -->
<!-- Buraya Google Stitch'ten üretilen Final ekran görüntüsü eklenebilir -->
<!-- Örnek: ![Final Screen](./stitch-designs/final.png) -->

---

## UI Componentleri

| Component | Dosya | Açıklama |
|-----------|-------|----------|
| `Onboarding` | `Onboarding.jsx` | Giriş ekranı, profil oluşturma |
| `Scenario` | `Scenario.jsx` | Senaryo yöneticisi (intro/decision/feedback state machine) |
| `DecisionCard` | `DecisionCard.jsx` | Karar seçenekleri kartı |
| `FeedbackPanel` | `FeedbackPanel.jsx` | "Ne Oldu / Neden Oldu" paneli |
| `TutorPanel` | `TutorPanel.jsx` | AI Tutor accordion |
| `Timer` | `Timer.jsx` | Circular SVG countdown timer |
| `FinalScreen` | `FinalScreen.jsx` | Sonuç ve ders ekranı |

---

## Renk Paleti

```css
/* Background */
--color-bg:        #0d1117  /* Ana zemin (GitHub dark) */
--color-bg-card:   #161b22  /* Kart zemini */

/* Metin */
--color-text-primary:   #e6edf3  /* Ana metin */
--color-text-secondary: #8b949e  /* İkincil metin */
--color-text-muted:     #6e7681  /* Soluk metin */

/* Vurgu */
--color-accent:  #58a6ff  /* Mavi — interaktif elementler */
--color-tutor:   #bc8cff  /* Mor — AI Tutor */

/* Durum */
--color-success: #3fb950  /* Yeşil — iyi karar */
--color-warning: #d29922  /* Sarı — orta risk */
--color-danger:  #f85149  /* Kırmızı — yüksek risk */
```

**Kontrast oranları** (WCAG AA standartı):
- Primary text / BG: 12.6:1 ✅
- Accent / BG: 4.8:1 ✅
- Danger / BG: 4.5:1 ✅

---

## Typography

| Kullanım | Font | Weight |
|----------|------|--------|
| Başlıklar | Inter | 700–800 |
| Gövde | Inter | 400–500 |
| Kod / log / ID | JetBrains Mono | 400–500 |

- **Temel font boyutu**: 16px (1rem)
- **Minimum okunabilir**: 0.75rem (12px) — badge ve meta bilgileri
- **Line height**: 1.6–1.75 (okunabilirlik için)

---

## Accessibility Kararları

1. **Renk + metin birlikte**: Durum bilgisi yalnızca renkle değil, ikon + metin ile de gösteriliyor
2. **`aria-pressed`**: Seçim butonlarında durum erişilebilirlik özelliği var
3. **`aria-expanded`**: Tutor accordion'da açık/kapalı durumu
4. **Touch target**: Minimum 44×44px (Apple HIG standartı)
5. **Kontrast**: WCAG AA minimum oran sağlanıyor
6. **Focus styling**: Tab navigasyonu için visible focus ring
7. **`alt` ve `data-testid`**: Cypress testleri için anlamsal testid'ler

---

## Google Stitch Entegrasyonu

SE Primer, Google Stitch ile tasarlanmış ekranlara uygun bir yapıya sahiptir.
Stitch tasarımları projeye şu şekilde aktarılabilir:

### Aktarım Adımları

1. Google Stitch'te 3 ana ekranı (Onboarding, Scenario, Final) oluştur
2. Export edilmiş tasarım dosyalarını `public/stitch-designs/` klasörüne koy
3. Bu DESIGN.md dosyasındaki placeholder alanlarına (`<!-- STITCH SCREENSHOT PLACEHOLDER -->`) ilgili görsel yolunu ekle

### Stitch'ten CSS Aktarımı

Stitch'in ürettiği renk ve spacing değerleri `src/styles/global.css` içindeki CSS variables ile eşleştirilebilir:

| Stitch Token | SE Primer Variable |
|-------------|-------------------|
| `surface-primary` | `--color-bg-card` |
| `accent-primary` | `--color-accent` |
| `text-primary` | `--color-text-primary` |
| `border-default` | `--color-border` |

### Uygun Component Yapısı

Stitch ekranlarından JSX componentlerine dönüşüm sırasında:
- Her Stitch frame → ayrı bir JSX component
- Stitch auto-layout → CSS Flexbox / Grid
- Stitch color styles → CSS custom properties

---

## Responsive Breakpoints

| Breakpoint | Layout | Container |
|-----------|--------|-----------|
| < 480px | Tek sütun | %100 padding |
| 480px–768px | Tek sütun | max-width 480px |
| > 768px | Ortalanmış kart | max-width 680px |

---

## Animasyon ve Geçişler

| Animasyon | Kullanım | Süre |
|-----------|----------|------|
| `fadeInUp` | Ekran geçişleri, yeni panel | 350ms |
| `pulse` | Status dot, timer urgent | 1.5s infinite |
| Hover transitions | Buton, seçim kartı | 150ms |
| Progress bar fill | Karar ilerlemesi | 400ms |

Animasyonlar `prefers-reduced-motion` medya sorgusuna göre devre dışı bırakılabilir (ileride eklenebilir).
