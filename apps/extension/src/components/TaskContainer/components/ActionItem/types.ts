import { ActionStatus, ValidationStatus } from "@/contexts";

export interface ActionItemProps {
  id: number;
  description: string;
  type: string;
  action: string;
  status: ActionStatus;
  validationStatus: ValidationStatus;
  isActive: boolean;
  isManualIntervention?: boolean;
}
