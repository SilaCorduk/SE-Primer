/**
 * SE Primer — Canlı Sunum & Video Demosu (00-demo.cy.js)
 * 
 * Yaklaşık 60 saniyelik uçtan uca interaktif akış.
 * Cypress Open Mode çalıştırıldığında:
 * - Solda net adım başlıkları (cy.log)
 * - Sağda mobil (390x844) viewport içinde gerçekçi kriz simülasyonu
 * 
 * Akış: Onboarding -> Karar 1 (Fix-Forward) -> Karar 2 (Canary) -> Karar 3 (KVKK Maskeleme) -> Başarılı Final -> Restart
 */

describe('SE Primer — Canlı Sunum Demosu (~60 Saniye)', () => {
  it('Mobil görünümde tam senaryoyu adım adım deneyimler', () => {
    // 1. Mobil viewport ve uygulamayı aç
    cy.viewport(390, 844)
    cy.visit('/')

    cy.log('🟢 [00:00] GİRİŞ: Onboarding Ekranı Görüntüleniyor')
    cy.get('.onboarding-header').should('be.visible')
    cy.wait(2000)

    // 2. Kişiselleştirme Seçimleri
    cy.log('🎯 [00:02] KİŞİSELLEŞTİRME: Seviye -> Orta Seviye')
    cy.get('[data-testid="level-intermediate"]').scrollIntoView().click()
    cy.wait(1200)

    cy.log('💼 [00:04] KİŞİSELLEŞTİRME: Rol -> Frontend Developer')
    cy.get('[data-testid="role-frontend"]').scrollIntoView().click()
    cy.wait(1200)

    cy.log('🎯 [00:06] KİŞİSELLEŞTİRME: Hedef -> Doğru teknik karar vermeyi öğrenmek')
    cy.get('[data-testid="goal-decisions"]').scrollIntoView().click()
    cy.wait(1200)

    // 3. Senaryoyu Başlat
    cy.log('🚨 [00:08] SENARYO: Başlatılıyor')
    cy.get('[data-testid="start-button"]').scrollIntoView().click()
    cy.wait(1000)

    // 4. Kriz Brifingi (Senaryo Giriş Ekranı)
    cy.log('📋 [00:10] KRİZ BRİFİNGİ: Olay #2024-1847 ve Sistem Durumu')
    cy.get('.intro-alert').should('be.visible')
    cy.wait(3000)

    cy.get('[data-testid="intro-start-button"]').scrollIntoView().click()
    cy.wait(1000)

    // 5. Karar 1: Deployment / Mimari
    cy.log('⚖️ [00:15] KARAR 1/3: Deployment / Mimari (Sistem Geri Kazanımı)')
    cy.get('[data-testid="decision-card-1"]').should('be.visible')
    cy.wait(2500)

    cy.log('🤖 [00:18] AI TUTOR: Sokratik İpucu Açılıyor')
    cy.get('[data-testid="tutor"]').scrollIntoView().click()
    cy.get('.tutor-content').should('be.visible')
    cy.wait(3500)

    cy.log('🔧 [00:22] KARAR SEÇİMİ: B — Yerinde Düzeltme (Fix-Forward)')
    cy.get('[data-testid="decision-b"]').scrollIntoView().click()
    cy.wait(1000)

    cy.log('💡 [00:24] GERİ BİLDİRİM: Ne Oldu? & Neden Oldu?')
    cy.get('[data-testid="feedback-what"]').scrollIntoView().should('be.visible')
    cy.wait(2000)
    cy.get('[data-testid="feedback-why"]').scrollIntoView().should('be.visible')
    cy.wait(2500)

    cy.get('[data-testid="next-decision-button"]').scrollIntoView().click()
    cy.wait(1000)

    // 6. Karar 2: Test Stratejisi
    cy.log('🧪 [00:30] KARAR 2/3: Test Stratejisi (Doğrulama Süreci)')
    cy.get('[data-testid="decision-card-2"]').should('be.visible')
    cy.wait(2500)

    cy.log('🤖 [00:33] AI TUTOR: Test Stratejisi İpucu Açılıyor')
    cy.get('[data-testid="tutor"]').scrollIntoView().click()
    cy.get('.tutor-content').should('be.visible')
    cy.wait(3500)

    cy.log('🤖 [00:37] KARAR SEÇİMİ: B — Otomatik Regresyon + Kademeli Açılış (Canary)')
    cy.get('[data-testid="decision-b"]').scrollIntoView().click()
    cy.wait(1000)

    cy.log('💡 [00:39] GERİ BİLDİRİM: Kontrollü Açılış Analizi')
    cy.get('[data-testid="feedback-what"]').scrollIntoView().should('be.visible')
    cy.wait(2000)
    cy.get('[data-testid="feedback-why"]').scrollIntoView().should('be.visible')
    cy.wait(2500)

    cy.get('[data-testid="next-decision-button"]').scrollIntoView().click()
    cy.wait(1000)

    // 7. Karar 3: KVKK / Log Güvenliği
    cy.log('🔒 [00:45] KARAR 3/3: KVKK / Log Güvenliği (Kişisel Veri Koruması)')
    cy.get('[data-testid="decision-card-3"]').should('be.visible')
    cy.wait(2500)

    cy.log('🤖 [00:48] AI TUTOR: KVKK & Gizlilik İpucu Açılıyor')
    cy.get('[data-testid="tutor"]').scrollIntoView().click()
    cy.get('.tutor-content').should('be.visible')
    cy.wait(3500)

    cy.log('🛡️ [00:52] KARAR SEÇİMİ: A — Acil Maskeleme + DPO Bildirimi')
    cy.get('[data-testid="decision-a"]').scrollIntoView().click()
    cy.wait(1000)

    cy.log('💡 [00:54] GERİ BİLDİRİM: Veri İhlali Yönetimi Analizi')
    cy.get('[data-testid="feedback-what"]').scrollIntoView().should('be.visible')
    cy.wait(2000)
    cy.get('[data-testid="feedback-why"]').scrollIntoView().should('be.visible')
    cy.wait(2500)

    cy.log('📊 [00:59] FİNAL: Sonuç Raporu Hazırlanıyor')
    cy.get('[data-testid="next-decision-button"]').scrollIntoView().click()
    cy.wait(1000)

    // 8. Final Ekranı
    cy.log('🏆 [01:01] BAŞARILI FİNAL: Sistem Güvenle Ayağa Kalktı (FINAL_A)')
    cy.get('[data-testid="final-screen"]').should('be.visible')
    cy.get('.outcome-card').scrollIntoView().should('be.visible')
    cy.wait(3000)

    cy.log('📈 [01:05] SİSTEM & VERİ GÜVENLİĞİ DURUMU')
    cy.get('.status-cards').scrollIntoView().should('be.visible')
    cy.wait(2500)

    cy.log('📋 [01:08] 3 KARARIN DÖKÜMÜ & RİSK DEĞERLENDİRMESİ')
    cy.get('.decisions-review').scrollIntoView().should('be.visible')
    cy.wait(3000)

    cy.log('🎓 [01:12] KAZANILAN MÜHENDİSLİK DERSLERİ')
    cy.get('.lessons').scrollIntoView().should('be.visible')
    cy.wait(3500)

    // 9. Tekrar Oyna
    cy.log('🔄 [01:16] SİMÜLASYONU YENİDEN BAŞLAT')
    cy.get('[data-testid="restart-button"]').scrollIntoView().click()
    cy.wait(1500)

    // 10. Başlangıç Onboarding Ekranına Dönüldüğünü Doğrula
    cy.log('✅ [01:18] BAŞLANGICA DÖNÜLDÜ: Demo Başarıyla Tamamlandı')
    cy.get('[data-testid="start-button"]').should('exist').and('be.disabled')
    cy.wait(2000)
  })
})
