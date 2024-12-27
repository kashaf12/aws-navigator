import { Flow } from "@aws-navigator/schemas";

export interface FlowSelectorProps {
  flows: Flow[];
  selectedFlowId?: number;
  onFlowSelect: (flowId: number) => void;
  isDisabled?: boolean;
}
