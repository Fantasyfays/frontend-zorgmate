const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'i15wb9',
  e2e: {
    baseUrl: "http://localhost:3000",
  },
});
