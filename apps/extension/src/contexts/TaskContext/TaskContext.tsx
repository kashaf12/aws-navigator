import { createContext, useState } from "react";
import { Task } from "@aws-navigator/schemas";
import { TASK_STORAGE_KEY, extractUniqueSelectors } from "@/utils";
import {
  TaskContextType,
  TaskProviderProps,
  TaskStatus,
  TaskWithStatus,
} from "./types";

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [currentTask, setCurrentTask] = useState<TaskWithStatus | null>(null);

  const startTask = (task: Task) => {
    const taskWithStatus: TaskWithStatus = {
      ...task,
      status: TaskStatus.IN_PROGRESS,
      currentStepIndex: 0,
    };
    setCurrentTask(taskWithStatus);

    if (task.steps.length > 0) {
      const selectors = extractUniqueSelectors(task);
      highlightElements(selectors);
    }

    // Save to local storage
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskWithStatus));
  };

  const completeStep = (stepIndex: number) => {
    if (!currentTask) return;

    const isLastStep = stepIndex === currentTask.steps.length - 1;
    const newStatus = isLastStep
      ? TaskStatus.COMPLETED
      : TaskStatus.IN_PROGRESS;

    const updatedTask = {
      ...currentTask,
      status: newStatus,
      currentStepIndex: isLastStep ? stepIndex : stepIndex + 1,
    };

    setCurrentTask(updatedTask);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updatedTask));

    // If there's a next step, highlight its elements
    if (!isLastStep && currentTask.steps[stepIndex + 1]) {
      const nextStep = currentTask.steps[stepIndex + 1];
      const selectors = nextStep.ui_elements.map(
        (element) => element.identifier.css_selector
      );
      highlightElements(selectors);
    }
  };

  const resetTask = () => {
    setCurrentTask(null);
    localStorage.removeItem(TASK_STORAGE_KEY);
  };

  const highlightElements = (selectors: string[]) => {
    // Implement your highlighting logic here
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Add highlighting effect
        // You can implement this based on your UI requirements
      }
    });
  };

  return (
    <TaskContext.Provider
      value={{
        currentTask,
        startTask,
        completeStep,
        resetTask,
        highlightElements,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
