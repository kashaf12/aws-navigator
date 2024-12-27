import StepAccordion from "../StepAccordion";
import classes from "./styles.module.css";
import { StepNavigatorProps } from "./types";

const StepNavigator = ({
  task,
  selectedFlows,
  onFlowSelect,
}: StepNavigatorProps) => {
  return (
    <div className={classes.stepNavigator}>
      {task.steps.map((step, index) => (
        <StepAccordion
          key={step.id}
          step={step}
          isActive={index === task.currentStepIndex}
          isCompleted={index < task.currentStepIndex}
          isOptional={Boolean(step.optional)}
          selectedFlow={step.flows.find(
            (flow) => flow.id === selectedFlows[index]
          )}
          onFlowSelect={(flowId) => onFlowSelect(index, flowId)}
        />
      ))}
    </div>
  );
};

export default StepNavigator;
