import { createContext, useState, useEffect } from "react";
import { sendMessage, onMessage } from "webext-bridge/popup";
import { TabState, TabContextType, TabProviderProps } from "./types";

export const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: TabProviderProps) => {
  const [tabState, setTabState] = useState<TabState>({
    activeTabId: null,
    tabs: {},
  });

  useEffect(() => {
    // Setup message listener for state updates
    const unsubscribe = onMessage("tab:state", ({ data }) => {
      setTabState((prev) => ({
        ...prev,
        ...data,
      }));
    });

    // Get initial state
    const initializeState = async () => {
      try {
        const state = await sendMessage("tab:query", undefined, "background");
        setTabState(state);
      } catch (error) {
        console.error("[AWS Navigator] Error fetching tab state:", error);
      }
    };

    initializeState();

    // Cleanup
    return () => {
      unsubscribe();
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
