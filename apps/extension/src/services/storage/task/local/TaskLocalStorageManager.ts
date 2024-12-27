import { ActiveTask } from "@/contexts";
import { ACTIVE_TASK_STORAGE_KEY } from "@/utils/constants";
import { TaskStorageManager } from "../types";

class TaskLocalStorageManager implements TaskStorageManager {
  private readonly STORAGE_KEY = ACTIVE_TASK_STORAGE_KEY;

  async getActiveTask(): Promise<ActiveTask | null> {
    const storedTask = localStorage.getItem(this.STORAGE_KEY);
    if (!storedTask) return null;

    try {
      const parsedTask = JSON.parse(storedTask, (key, value) => {
        // Handle date parsing for relevant fields
        if (
          key === "timestamp" ||
          key === "startedAt" ||
          key === "completedAt"
        ) {
          return value ? new Date(value) : value;
        }
        return value;
      });

      return parsedTask as ActiveTask;
    } catch (error) {
      console.error("[AWS Navigator] Error parsing stored task:", error);
      return null;
    }
  }

  async setActiveTask(task: ActiveTask | null): Promise<void> {
    if (task) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(task));
    } else {
      await this.clearActiveTask();
    }
  }

  async updateTaskProgress(
    taskId: string,
    updates: Partial<ActiveTask>,
  ): Promise<void> {
    const currentTask = await this.getActiveTask();

    if (!currentTask || currentTask.id !== taskId) {
      throw new Error("No active task found with the specified ID");
    }

    const updatedTask = {
      ...currentTask,
      ...updates,
    };

    await this.setActiveTask(updatedTask);
  }

  async clearActiveTask(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default TaskLocalStorageManager;
