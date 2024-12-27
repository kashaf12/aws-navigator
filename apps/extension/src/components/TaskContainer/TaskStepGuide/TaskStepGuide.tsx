import { TaskStatus } from "@/contexts";
import { CheckCircle, Circle, XCircle } from "lucide-react";
import classes from "./styles.module.css";
import { TaskStepGuideProps } from "./types";

const TaskStepGuide = ({ task, onCompleteStep }: TaskStepGuideProps) => {
  const getStepIcon = (index: number) => {
    if (index < task.currentStepIndex) {
      return <CheckCircle className={classes.completedIcon} size={20} />;
    } else if (index === task.currentStepIndex) {
      return <Circle className={classes.currentIcon} size={20} />;
    }
    return <Circle className={classes.pendingIcon} size={20} />;
  };

  return (
    <div className={classes.container}>
      {task.steps.map((step, index) => (
        <div
          key={step.step_number}
          className={`${classes.stepItem} ${index === task.currentStepIndex ? classes.active : ""}`}
        >
          <div className={classes.stepIndicator}>
            {getStepIcon(index)}
            {index !== task.steps.length - 1 && (
              <div className={classes.stepLine} />
            )}
          </div>
          <div className={classes.stepContent}>
            <div className={classes.stepDescription}>{step.description}</div>
            {index === task.currentStepIndex && (
              <div className={classes.stepActions}>
                <button
                  className={classes.completeButton}
                  onClick={() => onCompleteStep(index)}
                >
                  Complete Step
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {task.status === TaskStatus.COMPLETED && (
        <div className={classes.completedMessage}>
          <CheckCircle className={classes.completedIcon} size={20} />
          Task Completed
        </div>
      )}

      {task.status === TaskStatus.FAILED && (
        <div className={classes.failedMessage}>
          <XCircle className={classes.failedIcon} size={20} />
          Task Failed
        </div>
      )}
    </div>
  );
};

export default TaskStepGuide;
