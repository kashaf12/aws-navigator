import TaskAccordion from "../TaskAccordion";
import classes from "./styles.module.css";
import { TaskItemProps } from "./types";

const TaskItem = ({ task, onStartTask }: TaskItemProps) => (
  <li className={classes.taskItem}>
    <h5 className={classes.taskName}>{task.task}</h5>
    <TaskAccordion task={task} onStartTask={onStartTask} />
  </li>
);

export default TaskItem;
