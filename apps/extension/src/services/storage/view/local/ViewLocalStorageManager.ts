import { ViewType } from "@/contexts";
import { ACTIVE_VIEW_STORAGE_KEY } from "@/utils/constants";
import { ViewStorageManager } from "../types";

class ViewLocalStorageManager implements ViewStorageManager {
  private readonly STORAGE_KEY = ACTIVE_VIEW_STORAGE_KEY;

  async getActiveView(): Promise<ViewType | null> {
    const storedView = localStorage.getItem(this.STORAGE_KEY);
    if (!storedView) return null;

    // Validate that the stored value is a valid ViewType
    return Object.values(ViewType).includes(storedView as ViewType)
      ? (storedView as ViewType)
      : null;
  }

  async setActiveView(view: ViewType): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, view);
  }
}

export default ViewLocalStorageManager;
