import classes from "./styles.module.css";
import { MessageSquare, ListRestart, Trash2 } from "lucide-react";
import Tooltip from "../../Tooltip";
import { PositionType } from "../../Navigation";
import { TaskDetailsProps } from "./types";

const TaskDetails = ({
  task,
  onReset,
  onReturnToChat,
  isChatAvailable,
  onDelete,
}: TaskDetailsProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.main}>
        <span className={classes.stepCount}>
          {task?.currentStepIndex + 1}/{task.steps.length}
        </span>
        <h2 className={classes.taskTitle} title={task.task}>
          {task.task}
        </h2>
      </div>
      <div className={classes.actions}>
        {isChatAvailable && (
          <Tooltip
            content="Return to Chat"
            position={PositionType.Left}
            delay={300}
          >
            <button onClick={onReturnToChat} className={classes.actionButton}>
              <MessageSquare size={16} />
            </button>
          </Tooltip>
        )}
        {Boolean(task.currentStepIndex) && (
          <Tooltip
            content="Reset Task"
            position={PositionType.Left}
            delay={300}
          >
            <button onClick={onReset} className={classes.resetButton}>
              <ListRestart size={16} />
            </button>
          </Tooltip>
        )}
        <Tooltip content="Remove Task" position={PositionType.Left} delay={300}>
          <button onClick={onDelete} className={classes.resetButton}>
            <Trash2 size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default TaskDetails;
