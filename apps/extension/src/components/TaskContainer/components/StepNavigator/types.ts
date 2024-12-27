import { ActiveTask } from "@/contexts";

export interface StepNavigatorProps {
  task: ActiveTask;
  selectedFlows: Record<number, number>;
  onFlowSelect: (stepIndex: number, flowId: number) => void;
}
