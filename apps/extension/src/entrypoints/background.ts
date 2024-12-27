import { TabMessageType, TabStatus } from "@/contexts";

export default defineBackground(() => {
  console.log("[AWS Navigator] Background Service Worker Started", {
    id: browser.runtime.id,
  });

  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) =>
      console.error(
        "[AWS Navigator] error from side panel backgroundjs:",
        error
      )
    );

  // Function to notify about tab updates
  const notifyTabUpdate = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    chrome.runtime.sendMessage({
      type: TabMessageType.TAB_UPDATE,
      payload: {
        tabs: {
          [tabId]: {
            id: tabId,
            url: tab.url || "",
            status: tab.active ? TabStatus.ACTIVE : TabStatus.INACTIVE,
            title: tab.title,
          },
        },
      },
    });
  };

  // Function to notify about active tab changes
  const notifyActiveTabUpdate = (activeInfo: chrome.tabs.TabActiveInfo) => {
    chrome.runtime.sendMessage({
      type: TabMessageType.ACTIVE_TAB_UPDATE,
      payload: {
        activeTabId: activeInfo.tabId,
      },
    });
  };

  // Listen for tab updates
  chrome.tabs.onUpdated.addListener(notifyTabUpdate);

  // Listen for tab activation
  chrome.tabs.onActivated.addListener(notifyActiveTabUpdate);

  // Listen for tab removal
  chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.runtime.sendMessage({
      type: TabMessageType.TAB_UPDATE,
      payload: {
        tabs: {
          [tabId]: undefined, // This will remove the tab from the state
        },
      },
    });
  });
});
