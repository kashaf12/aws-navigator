import classes from "./styles.module.css";
import Accordion from "../Accordion";
import { SquarePlay } from "lucide-react";
import { TaskAccordionProps } from "./types";

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
                <span className={classes.stepNumber}>{step.id}.</span>
                <span className={classes.stepDescription}>
                  {step.description}
                </span>
                {step.optional && (
                  <span className={classes.stepOptional}>
                    <i>(optional)</i>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Accordion>
      <button className={classes.startButton} onClick={() => onStartTask(task)}>
        <SquarePlay size={20} />
        Start Task
      </button>
    </div>
  );
};

export default TaskAccordion;
