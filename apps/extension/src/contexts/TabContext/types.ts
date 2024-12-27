export enum TabStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Tab {
  id: number;
  url: string;
  status: TabStatus;
  title?: string;
}

export interface TabState {
  activeTabId: number | null;
  tabs: Record<number, Tab>;
}

export enum TabMessageType {
  TAB_UPDATE = "TAB_UPDATE",
  ACTIVE_TAB_UPDATE = "ACTIVE_TAB_UPDATE",
}

export interface TabMessage {
  type: TabMessageType;
  payload: Partial<TabState>;
}

export interface TabContextType extends TabState {
  isAWSConsole: boolean;
}

export interface TabProviderProps {
  children: React.ReactNode;
}
