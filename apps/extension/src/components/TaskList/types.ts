import { Task } from "@aws-navigator/schemas";

export interface TaskListProps {
  tasks: Task[];
  onStartTask: (task: Task) => void;
}
