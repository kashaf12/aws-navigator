import classes from "./styles.module.css";
import { TaskItemProps } from "./types";

const TaskItem = ({ task, onStartTask }: TaskItemProps) => (
  <li className={classes.taskItem}>
    <h5 className={classes.taskName}>{task.task}</h5>
    <button
      onClick={() => onStartTask(task)}
      className={classes.highlightButton}
    >
      Start Task
    </button>
  </li>
);

export default TaskItem;
