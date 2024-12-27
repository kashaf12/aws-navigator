import { Flow, Step } from "@aws-navigator/schemas";

export interface StepAccordionProps {
  step: Step;
  isActive: boolean;
  isCompleted: boolean;
  isOptional: boolean;
  selectedFlow?: Flow;
  onFlowSelect: (flowId: number) => void;
}
