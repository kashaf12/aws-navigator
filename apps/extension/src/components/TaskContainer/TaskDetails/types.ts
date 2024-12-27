import { ActiveTask } from "@/contexts";

export interface TaskDetailsProps {
  task: ActiveTask;
  onReset: () => void;
  onReturnToChat: () => void;
  isChatAvailable: boolean;
}
