import { Task } from "@aws-navigator/schemas";
import classes from "./styles.module.css";
import Accordion from "../Accordion";

interface TaskAccordionProps {
  task: Task;
  onStartTask: (task: Task) => void;
}

const TaskAccordion = ({ task, onStartTask }: TaskAccordionProps) => {
  const trigger = (
    <div className={classes.header}>
      <span className={classes.viewSteps}>View Steps</span>
    </div>
  );

  return (
    <div className={classes.container}>
      <Accordion trigger={trigger} className={classes.taskAccordion}>
        <div className={classes.stepsContainer}>
          <ol className={classes.stepsList}>
            {task.steps.map((step, index) => (
              <li key={index} className={classes.stepItem}>
                <span className={classes.stepNumber}>{step.step_number}.</span>
                <span className={classes.stepDescription}>
                  {step.description}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Accordion>
      <button className={classes.startButton} onClick={() => onStartTask(task)}>
        Start Task
      </button>
    </div>
  );
};

export default TaskAccordion;
