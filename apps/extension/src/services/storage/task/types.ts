import { ActiveTask } from "@/contexts";

export interface TaskStorageManager {
  /**
   * Gets the currently active task from storage
   * @returns Promise resolving to the active task or null if not set
   */
  getActiveTask(): Promise<ActiveTask | null>;

  /**
   * Sets the active task in storage
   * @param task - The task to set as active
   * @returns Promise that resolves when the operation is complete
   */
  setActiveTask(task: ActiveTask | null): Promise<void>;

  /**
   * Updates the task's status and current step
   * @param taskId - The ID of the task to update
   * @param updates - Partial task object with updates
   * @returns Promise that resolves when the operation is complete
   */
  updateTaskProgress(
    taskId: string,
    updates: Partial<ActiveTask>,
  ): Promise<void>;

  /**
   * Removes the active task from storage
   * @returns Promise that resolves when the operation is complete
   */
  clearActiveTask(): Promise<void>;
}
