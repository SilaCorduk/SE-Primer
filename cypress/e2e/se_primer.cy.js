/**
 * SE Primer — Cypress E2E Tests
 * All core user journeys tested.
 * Uses data-testid selectors for stability.
 */

describe('SE Primer E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // ─────────────────────────────────────────────
  // TEST 1: Yeni başlayan kullanıcı uygulamayı başlatabiliyor mu?
  // ─────────────────────────────────────────────
  it('Test 1 — Yeni başlayan kullanıcı uygulamayı başlatabilmeli', () => {
    // Start button should be disabled initially
    cy.get('[data-testid="start-button"]').should('be.disabled')

    // Select level: beginner
    cy.get('[data-testid="level-beginner"]').click()

    // Select role: backend
    cy.get('[data-testid="role-backend"]').click()

    // Select goal: decisions
    cy.get('[data-testid="goal-decisions"]').click()

    // Start button should now be enabled
    cy.get('[data-testid="start-button"]').should('not.be.disabled')

    // Click start
    cy.get('[data-testid="start-button"]').click()

    // Should see intro screen
    cy.get('[data-testid="intro-start-button"]').should('exist')
  })

  // ─────────────────────────────────────────────
  // TEST 2: Kullanıcı 3 kararın tamamını verebiliyor mu?
  // ─────────────────────────────────────────────
  it('Test 2 — Kullanıcı 3 kararın tamamını verebilmeli', () => {
    // Onboarding
    cy.get('[data-testid="level-intermediate"]').click()
    cy.get('[data-testid="role-swe"]').click()
    cy.get('[data-testid="goal-testing"]').click()
    cy.get('[data-testid="start-button"]').click()

    // Intro → Decision 1
    cy.get('[data-testid="intro-start-button"]').click()

    // Decision 1
    cy.get('[data-testid="decision-a"]').should('exist')
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 2
    cy.get('[data-testid="decision-b"]').should('exist')
    cy.get('[data-testid="decision-b"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 3
    cy.get('[data-testid="decision-a"]').should('exist')
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Should reach final screen
    cy.get('[data-testid="final-screen"]').should('exist')
  })

  // ─────────────────────────────────────────────
  // TEST 3: Karar sonrası feedback paneli görünüyor mu?
  // ─────────────────────────────────────────────
  it('Test 3 — Karar sonrası "Ne oldu?" ve "Neden oldu?" gösterilmeli', () => {
    // Onboarding
    cy.get('[data-testid="level-beginner"]').click()
    cy.get('[data-testid="role-qa"]').click()
    cy.get('[data-testid="goal-security"]').click()
    cy.get('[data-testid="start-button"]').click()

    // Intro
    cy.get('[data-testid="intro-start-button"]').click()

    // Make first decision
    cy.get('[data-testid="decision-a"]').click()

    // Feedback panels should appear
    cy.get('[data-testid="feedback-what"]').should('be.visible')
    cy.get('[data-testid="feedback-why"]').should('be.visible')

    // Content should not be empty
    cy.get('[data-testid="feedback-what"]').invoke('text').should('have.length.greaterThan', 20)
    cy.get('[data-testid="feedback-why"]').invoke('text').should('have.length.greaterThan', 20)
  })

  // ─────────────────────────────────────────────
  // TEST 4: İyi final (FINAL_A) görüntüleniyor mu?
  // ─────────────────────────────────────────────
  it('Test 4 — İyi final path: B, B, A → FINAL_A', () => {
    // Onboarding
    cy.get('[data-testid="level-intermediate"]').click()
    cy.get('[data-testid="role-backend"]').click()
    cy.get('[data-testid="goal-decisions"]').click()
    cy.get('[data-testid="start-button"]').click()
    cy.get('[data-testid="intro-start-button"]').click()

    // Decision 1: B (fix-forward — low risk)
    cy.get('[data-testid="decision-b"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 2: B (automated + canary — low risk)
    cy.get('[data-testid="decision-b"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 3: A (maskeleme — low risk)
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Should show good final
    cy.get('[data-testid="final-screen"]').should('exist')
    cy.get('[data-testid="final-screen"]').invoke('text').should('include', 'Başarılı')
  })

  // ─────────────────────────────────────────────
  // TEST 5: Farklı karar kombinasyonunda farklı final görünüyor mu?
  // ─────────────────────────────────────────────
  it('Test 5 — KVKK ihlali finali: Decision 3 = B → FINAL_B', () => {
    // Onboarding
    cy.get('[data-testid="level-beginner"]').click()
    cy.get('[data-testid="role-frontend"]').click()
    cy.get('[data-testid="goal-security"]').click()
    cy.get('[data-testid="start-button"]').click()
    cy.get('[data-testid="intro-start-button"]').click()

    // Decision 1: A
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 2: A
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Decision 3: B (KVKK ihlali — high risk)
    cy.get('[data-testid="decision-b"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Should show bad final with KVKK mention
    cy.get('[data-testid="final-screen"]').should('exist')
    cy.get('[data-testid="final-screen"]').invoke('text').should('include', 'KVKK')
  })

  // ─────────────────────────────────────────────
  // TEST 6: Tutor doğrudan cevap söylemiyor mu?
  // ─────────────────────────────────────────────
  it('Test 6 — Tutor doğrudan cevap vermemeli', () => {
    // Onboarding
    cy.get('[data-testid="level-beginner"]').click()
    cy.get('[data-testid="role-swe"]').click()
    cy.get('[data-testid="goal-decisions"]').click()
    cy.get('[data-testid="start-button"]').click()
    cy.get('[data-testid="intro-start-button"]').click()

    // Open tutor
    cy.get('[data-testid="tutor"]').click()

    // Wait for tutor content to load
    cy.get('[data-testid="tutor"]', { timeout: 5000 }).should('exist')

    // Tutor text should not contain direct answer phrases
    cy.get('[data-testid="tutor"]').invoke('text').then((text) => {
      const lowerText = text.toLowerCase()
      expect(lowerText).not.to.include('a seçeneğini seç')
      expect(lowerText).not.to.include('b seçeneğini seç')
      expect(lowerText).not.to.include('doğru cevap')
      expect(lowerText).not.to.include('a seçeneği doğru')
      expect(lowerText).not.to.include('b seçeneği doğru')
      expect(lowerText).not.to.include('a\'yı seç')
      expect(lowerText).not.to.include('b\'yi seç')
    })
  })

  // ─────────────────────────────────────────────
  // TEST 7: Deneyimli kullanıcıda timer görünüyor mu?
  // ─────────────────────────────────────────────
  it('Test 7 — Deneyimli kullanıcıda timer gösterilmeli', () => {
    // Onboarding with experienced level
    cy.get('[data-testid="level-experienced"]').click()
    cy.get('[data-testid="role-swe"]').click()
    cy.get('[data-testid="goal-architecture"]').click()
    cy.get('[data-testid="start-button"]').click()
    cy.get('[data-testid="intro-start-button"]').click()

    // Timer should be visible
    cy.get('[data-testid="timer"]').should('be.visible')
    cy.get('[data-testid="timer"]').invoke('text').should('match', /\d+|✗/)
  })

  // ─────────────────────────────────────────────
  // TEST 8: Tekrar Oyna butonu başlangıç durumuna döndürüyor mu?
  // ─────────────────────────────────────────────
  it('Test 8 — Tekrar Oyna başlangıca dönmeli', () => {
    // Complete a full run
    cy.get('[data-testid="level-beginner"]').click()
    cy.get('[data-testid="role-qa"]').click()
    cy.get('[data-testid="goal-testing"]').click()
    cy.get('[data-testid="start-button"]').click()
    cy.get('[data-testid="intro-start-button"]').click()

    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()
    cy.get('[data-testid="decision-b"]').click()
    cy.get('[data-testid="next-decision-button"]').click()
    cy.get('[data-testid="decision-a"]').click()
    cy.get('[data-testid="next-decision-button"]').click()

    // Should be on final screen
    cy.get('[data-testid="final-screen"]').should('exist')

    // Click restart
    cy.get('[data-testid="restart-button"]').click()

    // Should be back on onboarding (start button visible and disabled)
    cy.get('[data-testid="start-button"]').should('exist')
    cy.get('[data-testid="start-button"]').should('be.disabled')

    // Final screen should be gone
    cy.get('[data-testid="final-screen"]').should('not.exist')
  })
})
