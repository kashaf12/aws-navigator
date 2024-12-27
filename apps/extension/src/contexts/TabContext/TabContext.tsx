import { createContext, useState, useEffect } from "react";
import {
  Tab,
  TabState,
  TabMessage,
  TabMessageType,
  TabContextType,
  TabProviderProps,
  TabStatus,
} from "./types";

export const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: TabProviderProps) => {
  const [tabState, setTabState] = useState<TabState>({
    activeTabId: null,
    tabs: {},
  });

  useEffect(() => {
    const messageListener = (message: TabMessage) => {
      if (
        message.type === TabMessageType.TAB_UPDATE ||
        message.type === TabMessageType.ACTIVE_TAB_UPDATE
      ) {
        setTabState((prev) => ({
          ...prev,
          ...message.payload,
        }));
      }
    };

    // Initial state setup
    chrome.tabs.query({}, (tabs) => {
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
      setTabState({
        activeTabId: activeTab?.id || null,
        tabs: tabsMap,
      });
    });

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const isAWSConsole = Boolean(
    tabState.activeTabId &&
      tabState.tabs[tabState.activeTabId]?.url.includes(
        "console.aws.amazon.com"
      )
  );

  return (
    <TabContext.Provider
      value={{
        activeTabId: tabState.activeTabId,
        tabs: tabState.tabs,
        isAWSConsole,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
