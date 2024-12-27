import { ValidationStatus } from "@/contexts";
import { FlowSelectorProps } from "./types";
import classes from "./styles.module.css";
import FlowItem from "../FlowItem";
import Accordion from "@/components/Accordion";

const FlowSelector = ({
  flows,
  selectedFlowId,
  onFlowSelect,
}: FlowSelectorProps) => {
  // Sort flows by priority (lower priority first)
  const sortedFlows = [...flows].sort((a, b) => a.priority - b.priority);

  // Find the selected flow for displaying in the trigger
  const selectedFlow = sortedFlows.find((flow) => flow.id === selectedFlowId);

  const trigger = (
    <div className={classes.dropdownTrigger}>
      <span className={classes.triggerText}>
        {selectedFlow ? selectedFlow.description : "Select a flow"}
      </span>
    </div>
  );

  return (
    <div className={classes.flowSelector}>
      <Accordion
        trigger={trigger}
        className={`${classes.dropdown}`}
        defaultOpen={false}
      >
        <div className={classes.flowList}>
          {sortedFlows.map((flow) => (
            <FlowItem
              key={flow.id}
              flow={flow}
              isSelected={flow.id === selectedFlowId}
              validationStatus={ValidationStatus.VALID} // This should come from context/props in real implementation
              onSelect={() => onFlowSelect(flow.id)}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default FlowSelector;
