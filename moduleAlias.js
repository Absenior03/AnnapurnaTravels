// This file configures module aliasing for the application
const path = require("path");
const moduleAlias = require("module-alias");

// Add path aliases that match the ones in jsconfig.json and tsconfig.json
moduleAlias.addAliases({
  "@": path.resolve(__dirname, "./src"),
  "@/components": path.resolve(__dirname, "./components"),
  "@/context": path.resolve(__dirname, "./context"),
});

module.exports = moduleAlias;
