import { Task, Flow, Step } from "@aws-navigator/schemas";
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
  SKIPPED = "skipped",
}

export enum ValidationStatus {
  VALID = "valid",
  INVALID = "invalid",
  PENDING = "pending",
}

export enum ActionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  INVALID = "invalid",
}

export interface ActionProgress {
  status: ActionStatus;
  validationStatus: ValidationStatus;
}

export interface FlowProgress {
  flowId: number;
  validationStatus: ValidationStatus;
  isSelected: boolean;
  actionProgress: Record<number, ActionProgress>; // key is action.id
}

export interface StepProgress {
  status: TaskStatus;
  validationStatus: ValidationStatus;
  selectedFlowId?: number; // ID of the flow user selected or auto-selected
  flowProgress: Record<number, FlowProgress>; // key is flow.id
}

export interface ActiveTask extends Task {
  status: TaskStatus;
  currentStepIndex: number;
  stepProgress: Record<number, StepProgress>; // key is step.id
  chatReference: ChatReference;
}

export interface TaskContextType {
  currentTask: ActiveTask | null;
  startTask: (task: Task, chatRef: ChatReference) => Promise<void>;

  // Step related
  validateStep: (step: Step) => Promise<ValidationStatus>;
  completeStep: (stepIndex: number) => Promise<void>;
  skipStep: (stepIndex: number) => Promise<void>;

  // Flow related
  validateFlow: (flow: Flow, stepIndex: number) => Promise<ValidationStatus>;
  selectFlow: (flowId: number, stepIndex: number) => Promise<void>;

  // Action related
  validateAction: (
    actionId: number,
    flowId: number,
    stepIndex: number
  ) => Promise<ValidationStatus>;
  completeAction: (
    actionId: number,
    flowId: number,
    stepIndex: number
  ) => Promise<void>;

  // Task management
  resetTask: () => Promise<void>;
  deleteTask: () => Promise<void>;
}

export interface TaskProviderProps {
  children: ReactNode;
}
