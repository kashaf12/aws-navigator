import { Task } from "@aws-navigator/schemas";
import { ReactNode } from "react";

export enum TaskStatus {
  IDLE = "idle",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface TaskWithStatus extends Task {
  status: TaskStatus;
  currentStepIndex: number;
}

export interface TaskContextType {
  currentTask: TaskWithStatus | null;
  startTask: (task: Task) => void;
  completeStep: (stepIndex: number) => void;
  resetTask: () => void;
  highlightElements: (selectors: string[]) => void;
}

export interface TaskProviderProps {
  children: ReactNode;
}
