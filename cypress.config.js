const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/integration/**/*.{js,jsx,ts,tsx,feature}',
    viewportHeight: 1080,
    viewportWidth: 1920,
    screenshotsFolder: 'cypress/screenshots',
  },
});
