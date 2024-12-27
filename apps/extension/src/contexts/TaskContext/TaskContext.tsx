import { createContext, useState, useEffect } from "react";
import { Identifier, Task } from "@aws-navigator/schemas";
import {
  extractIdentifiersFromStep,
  extractIdentifiersFromTask,
  findElement,
} from "@/utils";
import {
  TaskContextType,
  TaskProviderProps,
  TaskStatus,
  ActiveTask,
  ChatReference,
} from "./types";
import { TaskLocalStorageManager } from "@/services";

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

const storageManager = new TaskLocalStorageManager();

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [currentTask, setCurrentTask] = useState<ActiveTask | null>(null);

  // Load initial task from storage
  useEffect(() => {
    const loadActiveTask = async () => {
      try {
        const storedTask = await storageManager.getActiveTask();
        if (storedTask) {
          setCurrentTask(storedTask);
          if (storedTask.steps.length > 0) {
            const selectors = extractIdentifiersFromTask(storedTask);
            highlightElements(selectors);
          }
        }
      } catch (error) {
        console.error("[AWS Navigator] Error loading active task:", error);
      }
    };
    loadActiveTask();
  }, []);

  const startTask = async (task: Task, chatRef: ChatReference) => {
    const activeTask: ActiveTask = {
      ...task,
      status: TaskStatus.IN_PROGRESS,
      currentStepIndex: 0,
      chatReference: chatRef,
    };

    try {
      await storageManager.setActiveTask(activeTask);
      setCurrentTask(activeTask);

      if (task.steps.length > 0) {
        const identifiers = extractIdentifiersFromTask(task);
        highlightElements(identifiers);
      }
    } catch (error) {
      console.error("[AWS Navigator] Error starting task:", error);
    }
  };

  const completeStep = async (stepIndex: number) => {
    if (!currentTask) return;

    try {
      const isLastStep = stepIndex === currentTask.steps.length - 1;
      const newStatus = isLastStep
        ? TaskStatus.COMPLETED
        : TaskStatus.IN_PROGRESS;

      const updates = {
        status: newStatus,
        currentStepIndex: isLastStep ? stepIndex : stepIndex + 1,
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);

      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));

      // If there's a next step, highlight its elements
      if (!isLastStep && currentTask.steps[stepIndex + 1]) {
        const nextStep = currentTask.steps[stepIndex + 1];
        const identifiers = extractIdentifiersFromStep(nextStep);
        highlightElements(identifiers);
      }
    } catch (error) {
      console.error("[AWS Navigator] Error completing step:", error);
    }
  };

  const resetTask = async () => {
    if (!currentTask) return;

    try {
      const updates = {
        status: TaskStatus.IN_PROGRESS,
        currentStepIndex: 0,
        completedAt: undefined,
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error resetting task:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await storageManager.clearActiveTask();
      setCurrentTask(null);
    } catch (error) {
      console.error("[AWS Navigator] Error deleting task:", error);
    }
  };

  const highlightElements = (identifiers: Identifier[]) => {
    identifiers.forEach((identifier) => {
      const element = findElement(identifier);
      if (element) {
        // Add your highlighting effect here
        // For example:
        element.classList.add("aws-navigator-highlight");
      } else {
        console.warn(
          "[AWS Navigator] Element not found for identifier:",
          identifier,
        );
      }
    });
  };

  return (
    <TaskContext.Provider
      value={{
        currentTask,
        startTask,
        completeStep,
        deleteTask,
        highlightElements,
        resetTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
