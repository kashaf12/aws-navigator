import { createContext, useState } from "react";
import { ViewContextType, ViewProviderProps, ViewType } from "./types";
import { ViewLocalStorageManager } from "@/services";

export const ViewContext = createContext<ViewContextType | undefined>(
  undefined,
);

const storageManager = new ViewLocalStorageManager();

export const ViewProvider = ({ children }: ViewProviderProps) => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.CurrentChat);

  useEffect(() => {
    const loadActiveView = async () => {
      try {
        const storedView = await storageManager.getActiveView();
        if (storedView) {
          setActiveView(storedView);
        }
      } catch (error) {
        console.error("[AWS Navigator] Error loading active view:", error);
      }
    };
    loadActiveView();
  }, []);

  const handleSetActiveView = async (view: ViewType) => {
    try {
      await storageManager.setActiveView(view);
      setActiveView(view);
    } catch (error) {
      console.error("[AWS Navigator] Error setting active view:", error);
    }
  };

  return (
    <ViewContext.Provider
      value={{
        activeView,
        setActiveView: handleSetActiveView,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
};
