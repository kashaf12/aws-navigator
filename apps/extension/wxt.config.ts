import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: "AWS Navigator",
    description: "AI-powered assistant for AWS Console",
    permissions: ["activeTab", "sidePanel", "storage"],
    host_permissions: ["https://*.console.aws.amazon.com/*"],
    action: {},
  },
});
