import { ValidationStatus } from "@/contexts";
import { FlowSelectorProps } from "./types";
import classes from "./styles.module.css";
import FlowItem from "../FlowItem";

const FlowSelector = ({
  flows,
  selectedFlowId,
  onFlowSelect,
  isDisabled,
}: FlowSelectorProps) => {
  // Sort flows by priority (higher priority first)
  const sortedFlows = [...flows].sort((a, b) => b.priority - a.priority);

  return (
    <div className={classes.flowSelector}>
      {sortedFlows.map((flow) => (
        <FlowItem
          key={flow.id}
          flow={flow}
          isSelected={flow.id === selectedFlowId}
          validationStatus={ValidationStatus.VALID} // This should come from context/props in real implementation
          onSelect={() => onFlowSelect(flow.id)}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

export default FlowSelector;
