import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { StepAccordionProps } from "./types";
import Accordion from "@/components/Accordion";
import classes from "./styles.module.css";
import ActionExecutor from "../ActionExecutor";
import FlowSelector from "../FlowSelector";

const StepAccordion = ({
  step,
  isActive,
  isCompleted,
  isOptional,
  selectedFlow,
  onFlowSelect,
}: StepAccordionProps) => {
  const getStepIcon = () => {
    if (isCompleted) {
      return <CheckCircle className={classes.completedIcon} size={20} />;
    }
    if (isActive) {
      return <Circle className={classes.activeIcon} size={20} />;
    }
    return <Circle className={classes.pendingIcon} size={20} />;
  };

  const stepHeader = (
    <div className={classes.stepHeader}>
      <div className={classes.stepIndicator}>
        {getStepIcon()}
        {isOptional && (
          <AlertCircle className={classes.optionalIcon} size={16} />
        )}
      </div>
      <div className={classes.stepInfo}>
        <span className={classes.stepNumber}>Step {step.id}</span>
        <h3 className={classes.stepTitle}>{step.description}</h3>
      </div>
      {isCompleted && <span className={classes.completedBadge}>Completed</span>}
      {isOptional && <span className={classes.optionalBadge}>Optional</span>}
    </div>
  );

  const stepContent = (
    <div className={classes.stepContent}>
      <div className={classes.flowSelectorWrapper}>
        <h4 className={classes.sectionTitle}>Available Flows</h4>
        <FlowSelector
          flows={step.flows}
          selectedFlowId={selectedFlow?.id}
          onFlowSelect={onFlowSelect}
          isDisabled={!isActive}
        />
      </div>
      {selectedFlow && isActive && (
        <div className={classes.actionExecutorWrapper}>
          <h4 className={classes.sectionTitle}>Current Flow</h4>
          <p className={classes.flowDescription}>{selectedFlow.description}</p>
          <ActionExecutor flow={selectedFlow} stepNumber={step.id} />
        </div>
      )}
    </div>
  );

  return (
    <Accordion
      trigger={stepHeader}
      defaultOpen={isActive}
      className={`${classes.stepAccordion} ${
        isActive ? classes.active : ""
      } ${isCompleted ? classes.completed : ""} ${
        isOptional ? classes.optional : ""
      }`}
    >
      {stepContent}
    </Accordion>
  );
};

export default StepAccordion;
