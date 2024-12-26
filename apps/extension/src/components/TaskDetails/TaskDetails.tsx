import classes from "./styles.module.css";
import { Info, MessageSquare, ListRestart } from "lucide-react";
import Accordion from "../Accordion";
import Tooltip from "../Tooltip";
import { PositionType } from "../Navigation";
import { TaskDetailsProps } from "./types";

const TaskDetails = ({
  task,
  onReset,
  onReturnToChat,
  isChatAvailable,
}: TaskDetailsProps) => {
  const TaskTrigger = (
    <div className={classes.triggerContent}>
      <div className={classes.triggerMain}>
        <span className={classes.stepCount}>
          {task.currentStepIndex + 1}/{task.steps.length}
        </span>
        <h2 className={classes.taskTitle}>{task.task}</h2>
      </div>
      <div className={classes.actionButtons}>
        {isChatAvailable && (
          <Tooltip
            content="Return to Chat"
            position={PositionType.Left}
            delay={300}
          >
            <button onClick={onReturnToChat} className={classes.actionButton}>
              <MessageSquare size={18} />
            </button>
          </Tooltip>
        )}
        <Tooltip content="Reset Task" position={PositionType.Left} delay={300}>
          <button onClick={onReset} className={classes.resetButton}>
            <ListRestart size={18} />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <Accordion trigger={TaskTrigger} defaultOpen={true}>
      <div className={classes.taskDetailsContainer}>
        {/* Task Info */}
        <div className={classes.taskInfo}>
          <div className={classes.infoItem}>
            <Info size={16} className={classes.icon} />
            <span>Task: "{task.task}"</span>
          </div>
        </div>

        {/* Task Description */}
        <div className={classes.description}>
          <p>{task.steps[task.currentStepIndex]?.description}</p>
        </div>
      </div>
    </Accordion>
  );
};

export default TaskDetails;
