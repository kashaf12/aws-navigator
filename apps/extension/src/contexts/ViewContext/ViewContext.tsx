import { createContext, useState } from "react";
import { ViewContextType, ViewProviderProps, ViewType } from "./types";

export const ViewContext = createContext<ViewContextType | undefined>(
  undefined,
);

export const ViewProvider = ({ children }: ViewProviderProps) => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.CurrentChat);

  const handleSetActiveView = (view: ViewType) => {
    setActiveView(view);
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
