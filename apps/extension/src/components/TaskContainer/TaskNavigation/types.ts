import { TaskStatus } from "@/contexts";

export interface TaskNavigationProps {
  currentStep: number;
  totalSteps: number;
  status: TaskStatus;
  onPrevious: () => Promise<void>;
  onNext: () => Promise<void>;
  onSkip: () => Promise<void>;
  onDone: () => Promise<void>;
}
