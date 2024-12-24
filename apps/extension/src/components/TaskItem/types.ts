import { Task } from "@aws-navigator/schemas";

export interface TaskItemProps {
  task: Task;
  onStartTask: (task: Task) => void;
}
