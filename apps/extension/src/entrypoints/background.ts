export default defineBackground(() => {
  console.log("[AWS Navigator] Background Service Worker Started", {
    id: browser.runtime.id,
  });

  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) =>
      console.error(
        "[AWS Navigator] error from side panel backgroundjs:",
        error,
      ),
    );

  // Function to check if tab is AWS and notify sidepanel
  const checkAndNotifyTabUpdate = async () => {
    try {
      // Notify all sidepanel instances about the change
      chrome.runtime
        .sendMessage({
          type: BACKGROUND_MESSAGE_TOPIC.TAB_UPDATE,
        })
        .catch((error) => {
          // Handle error if sidepanel is not open
          console.log("[AWS Navigator] No sidepanel listening:", error);
        });
    } catch (error) {
      console.error("[AWS Navigator] Error checking tab:", error);
    }
  };

  // Listen for tab updates
  chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("[AWS Navigator] Tab Activated:", activeInfo);
    checkAndNotifyTabUpdate();
  });

  // Listen for URL changes in the current tab
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      console.log("[AWS Navigator] Tab Updated:", {
        tabId,
        url: tab.url,
      });
      checkAndNotifyTabUpdate();
    }
  });
});
