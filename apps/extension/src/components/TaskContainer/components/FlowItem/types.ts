import { ValidationStatus } from "@/contexts";
import { Flow } from "@aws-navigator/schemas";

export interface FlowItemProps {
  flow: Flow;
  isSelected: boolean;
  validationStatus: ValidationStatus;
  onSelect: () => void;
  isDisabled?: boolean;
}
