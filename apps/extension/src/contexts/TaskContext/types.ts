import { Task } from "@aws-navigator/schemas";
import { ReactNode } from "react";

export interface ChatReference {
  chatId: string;
  messageId: number;
}

export enum TaskStatus {
  IDLE = "idle",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ActiveTask extends Task {
  status: TaskStatus;
  currentStepIndex: number;
  chatReference: ChatReference;
}

export interface TaskContextType {
  currentTask: ActiveTask | null;
  startTask: (task: Task, chatRef: ChatReference) => void;
  completeStep: (stepIndex: number) => void;
  resetTask: () => void;
  deleteTask: () => void;
  highlightElements: (selectors: string[]) => void;
}

export interface TaskProviderProps {
  children: ReactNode;
}
