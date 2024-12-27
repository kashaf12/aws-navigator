import { ViewType } from "@/contexts";

export interface ViewStorageManager {
  /**
   * Gets the currently active view from storage
   * @returns Promise resolving to the active view type or null if not set
   */
  getActiveView(): Promise<ViewType | null>;

  /**
   * Sets the active view in storage
   * @param view - The view type to set as active
   * @returns Promise that resolves when the operation is complete
   */
  setActiveView(view: ViewType): Promise<void>;
}
