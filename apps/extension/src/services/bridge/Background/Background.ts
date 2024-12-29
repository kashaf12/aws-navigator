import { onMessage, sendMessage } from "webext-bridge/background";
import { Tab, TabState, TabStatus } from "@/contexts";

class BackgroundBridge {
  private static instance: BackgroundBridge;
  private tabState: TabState = {
    activeTabId: null,
    tabs: {},
  };

  private constructor() {
    this.initialize();
  }

  public static getInstance(): BackgroundBridge {
    if (!BackgroundBridge.instance) {
      BackgroundBridge.instance = new BackgroundBridge();
    }
    return BackgroundBridge.instance;
  }

  private initialize() {
    this.setupTabListeners();
    this.setupMessageHandlers();
  }

  private setupTabListeners() {
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
    chrome.tabs.onActivated.addListener(this.onTabActivated.bind(this));
    chrome.tabs.onRemoved.addListener(this.onTabRemoved.bind(this));
  }

  private onTabUpdated(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) {
    this.updateTabState({
      tabs: {
        [tabId]: {
          id: tabId,
          url: tab.url || "",
          status: tab.active ? TabStatus.ACTIVE : TabStatus.INACTIVE,
          title: tab.title,
        },
      },
    });
  }

  private onTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
    this.updateTabState({
      activeTabId: activeInfo.tabId,
    });
  }

  private onTabRemoved(tabId: number) {
    const { ...remainingTabs } = this.tabState.tabs;
    delete remainingTabs[tabId];
    this.updateTabState({ tabs: remainingTabs });
  }

  private setupMessageHandlers() {
    onMessage("tab:query", this.handleTabQuery.bind(this));
  }

  private async handleTabQuery() {
    const tabs = await chrome.tabs.query({});
    const tabsMap = tabs.reduce(
      (acc, tab) => {
        if (tab.id) {
          acc[tab.id] = {
            id: tab.id,
            url: tab.url || "",
            status: tab.active ? TabStatus.ACTIVE : TabStatus.INACTIVE,
            title: tab.title,
          };
        }
        return acc;
      },
      {} as Record<number, Tab>
    );

    const activeTab = tabs.find((tab) => tab.active);
    this.updateTabState({
      activeTabId: activeTab?.id || null,
      tabs: tabsMap,
    });

    return this.tabState;
  }

  private async updateTabState(update: Partial<TabState>) {
    if (
      JSON.stringify(this.tabState) !==
      JSON.stringify({ ...this.tabState, ...update })
    ) {
      this.tabState = { ...this.tabState, ...update };
      await sendMessage("tab:state", update, "popup");
    }
  }
}

export const initBackgroundBridge = () => {
  BackgroundBridge.getInstance();
};

export default initBackgroundBridge;
