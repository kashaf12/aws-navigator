import TaskItem from "../TaskItem";
import classes from "./styles.module.css";
import { TaskListProps } from "./types";

const TaskList = ({ tasks, onStartTask }: TaskListProps) => (
  <div className={classes.tasksContainer}>
    <h4 className={classes.tasksTitle}>Available Tasks:</h4>
    <ul className={classes.tasksList}>
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onStartTask={onStartTask} />
      ))}
    </ul>
  </div>
);

export default TaskList;
