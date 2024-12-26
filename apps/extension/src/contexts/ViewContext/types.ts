export enum ViewType {
  CurrentChat = "current-chat",
  History = "history",
  Task = "TaskContainer",
  Settings = "settings",
  Documentation = "documentation",
  UserProfile = "user-profile",
}

export interface ViewContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export interface ViewProviderProps {
  children: React.ReactNode;
}
