import { initBackgroundBridge } from "@/services/bridge";

export default defineBackground(() => {
  // Initialize bridge service
  initBackgroundBridge();

  // Setup side panel behavior
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) =>
      console.error("[AWS Navigator] Error setting side panel behavior:", error)
    );

  console.log("[AWS Navigator] Background Service Worker Started", {
    id: browser.runtime.id,
  });
});
