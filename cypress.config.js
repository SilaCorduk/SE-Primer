import { defineConfig } from 'cypress'

export default defineConfig({
  video: true,
  videosFolder: 'cypress/videos',
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 390,
    viewportHeight: 844,
    video: true,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 8000,
  },
})
