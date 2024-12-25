export default defineBackground(() => {
  console.log("[AWS Navigator] Background Service Worker Started", {
    id: browser.runtime.id,
  });

  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error));

  // Listen for installation
  chrome.runtime.onInstalled.addListener((details) => {
    console.log("[AWS Navigator] Extension Installed/Updated", details);
  });

  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("[AWS Navigator] Tab Updated:", {
      tabId,
      changeInfo,
      url: tab.url,
    });

    if (changeInfo.status === "complete" && tab.url) {
      console.log("[AWS Navigator] Is AWS Console:", isAWSConsole(tab.url));
    }
  });

  // Listen for messages from popup or content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[AWS Navigator] Received Message:", {
      message,
      from: sender.url,
    });
    sendResponse({ received: true });
  });
});
