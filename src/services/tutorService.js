/**
 * tutorService.js
 * Modular AI Tutor service.
 * - Uses Gemini API when VITE_GEMINI_API_KEY is available
 * - Falls back to mock Socratic responses when API key is missing
 * All responses follow Socratic method — never give direct answers.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const SYSTEM_INSTRUCTION = `Sen bir yazılım mühendisliği eğitim asistanısın. 
Görüşen öğrenci bir hospital management system krizini yönetiyor.
Sokratik öğretim yöntemini kullan:
- ASLA doğrudan cevabı verme
- ASLA "A seçeneğini seç" veya "B doğru" gibi ifadeler kullanma  
- Düşündürücü sorular sor
- İpucu ver ama cevabı açık etme
- Kullanıcının kendi cevabına ulaşmasına yardım et
Yanıtların Türkçe olsun ve 2-3 cümleyi geçmesin.`

/**
 * Mock tutor hints for when Gemini API is unavailable.
 * Keyed by decisionId and level.
 */
const MOCK_HINTS = {
  'decision-1': {
    beginner: `Bir sistemi geri almadan önce şunu sormak gerekir: "Bu değişiklik sadece kod mu içeriyor, yoksa veritabanı şemasını da değiştirdi mi?" Eğer şema değişti ise, uygulama kodunu geri almak veritabanını da geri alır mı? Bu iki şeyin bağımsız olduğunu düşünürsek ne gibi bir risk ortaya çıkar?`,
    intermediate: `v3.2.1 bir migration script çalıştırdı. Rollback yaptığında uygulama kodu eski sürüme döner, peki veritabanı şeması ne olur? Bu uyumsuzluk production'da ne gibi sorunlara yol açabilir?`,
    experienced: `Bu deployment'ın migration stratejisi "additive" mi yoksa "breaking" mi? Code rollback ile schema rollback'in bağımsızlığını düşün — fix-forward alternatifi bu senaryoda daha mı temiz bir çözüm sunar?`,
  },
  'decision-2': {
    beginner: `Test yapmak güven sağlar. Ama her test yöntemi farklı düzeyde güven sağlar. Manuel test ile 10 kişiyi test etmek yerine sistemi önce 10 kişiye açıp sonra herkese açmak arasında ne fark var? İkinci yöntem sana ne kazandırır?`,
    intermediate: `Mevcut otomatik test süitinde 12 başarısız test var. Bu testleri "known issue" olarak işaretleyip devam mı etmeli, yoksa önce bu testlerin neden başarısız olduğunu anlamalı mıyız? Kademeli açılış bu riski nasıl azaltır?`,
    experienced: `Eksik test coverage ile yüksek risk deployment'ı nasıl dengeliyorsun? Canary release bu senaryoda ne sağlar? Post-mortem'da bu test stratejisini nasıl belgelerdik?`,
  },
  'decision-3': {
    beginner: `Logda hasta adı, sigorta numarası ve tanı kodu görünüyor. Bu bilgiler kişisel sağlık verisi sayılır. Şu an 40 kişinin bulunduğu bir Slack kanalında akıyor. Bu 40 kişinin hepsinin bu verilere erişim yetkisi var mıdır? Bu durum ne anlama gelir?`,
    intermediate: `KVKK'ya göre kişisel sağlık verisi "özel nitelikli kişisel veri" sayılır. Bu verilerin yetkisiz kişilerce görülmesi bir "veri ihlali" midir? İhlal tespitinde DPO'yu ne zaman bilgilendirmelisin — sistemi düzelttikten sonra mı, yoksa hemen mi?`,
    experienced: `KVKK Madde 12 ve GDPR Article 33 kapsamında değerlendir. "Privacy by design" ilkesi bu log konfigürasyonunu baştan nasıl şekillendirmeliydi? Data minimization prensibi açısından hata loglarında hangi alanlar bulunabilir?`,
  },
}

/**
 * Get a hint from the AI Tutor (Gemini or Mock).
 * @param {string} decisionId - Current decision ID
 * @param {string} level - 'beginner' | 'intermediate' | 'experienced'
 * @param {string} context - Optional additional context from scenario
 * @returns {Promise<{text: string, source: 'gemini'|'mock'}>}
 */
export async function getTutorHint(decisionId, level, context = '') {
  if (API_KEY && API_KEY !== 'your_gemini_api_key_here') {
    try {
      return await getGeminiHint(decisionId, level, context)
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock tutor:', err.message)
    }
  }
  return getMockHint(decisionId, level)
}

async function getGeminiHint(decisionId, level, context) {
  const levelMap = {
    beginner: 'Yeni başlayan öğrenci — daha açıklayıcı ve yönlendirici ama cevabı vermeyen ipucu.',
    intermediate: 'Orta seviye öğrenci — daha kısa ipucu.',
    experienced: 'Deneyimli öğrenci — minimum ipucu, mümkünse soru şeklinde.',
  }

  const prompt = `Senaryo: ${context}
Kullanıcı seviyesi: ${levelMap[level]}
Karar noktası ID: ${decisionId}

Bu öğrenciye Sokratik yöntemle bir ipucu ver. Cevabı açıkça verme.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty Gemini response')

  return { text, source: 'gemini' }
}

function getMockHint(decisionId, level) {
  const hints = MOCK_HINTS[decisionId]
  if (!hints) {
    return {
      text: 'Bu kararı verirken hangi riskleri ve faydaları değerlendiriyorsun? Her seçeneğin uzun vadeli etkisini düşün.',
      source: 'mock',
    }
  }
  const hint = hints[level] || hints['intermediate']
  return { text: hint, source: 'mock' }
}

/**
 * Check if we're using a real Gemini integration.
 */
export function isTutorLive() {
  return Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here')
}
