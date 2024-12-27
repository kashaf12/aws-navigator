import { ActiveTask } from "@/contexts";

export interface TaskDetailsProps {
  task: ActiveTask;
  onReset: () => void;
  onDelete: () => void;
  onReturnToChat: () => void;
  isChatAvailable: boolean;
}
