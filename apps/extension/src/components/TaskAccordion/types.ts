import { Task } from "@aws-navigator/schemas";

export interface TaskAccordionProps {
  task: Task;
  onStartTask: (task: Task) => void;
}
