import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "3t9ce7",
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 10000,
});
