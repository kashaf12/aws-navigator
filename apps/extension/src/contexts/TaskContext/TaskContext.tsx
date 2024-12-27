import { createContext, useState } from "react";
import { Task } from "@aws-navigator/schemas";
import { TASK_STORAGE_KEY, extractUniqueSelectors } from "@/utils";
import {
  TaskContextType,
  TaskProviderProps,
  TaskStatus,
  ActiveTask,
  ChatReference,
} from "./types";

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [currentTask, setCurrentTask] = useState<ActiveTask | null>(null);

  const startTask = (task: Task, chatRef: ChatReference) => {
    const activeTask: ActiveTask = {
      ...task,
      status: TaskStatus.IN_PROGRESS,
      currentStepIndex: 0,
      chatReference: chatRef,
    };
    setCurrentTask(activeTask);

    if (task.steps.length > 0) {
      const selectors = extractUniqueSelectors(task);
      highlightElements(selectors);
    }

    // Save to local storage
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(activeTask));
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
        (element) =>
          element.identifier.css_selector ||
          element.identifier.id ||
          element.identifier.custom_attribute ||
          element.identifier.text_content ||
          element.identifier.xpath
      );
      highlightElements(selectors as string[]);
    }
  };

  const deleteTask = () => {
    setCurrentTask(null);
    localStorage.removeItem(TASK_STORAGE_KEY);
  };

  const resetTask = () => {
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      status: TaskStatus.IN_PROGRESS,
      currentStepIndex: 0,
    };
    setCurrentTask(updatedTask);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updatedTask));
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
        deleteTask,
        highlightElements,
        resetTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
