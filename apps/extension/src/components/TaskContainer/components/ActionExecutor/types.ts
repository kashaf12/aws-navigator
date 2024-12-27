import { Flow } from "@aws-navigator/schemas";

export interface ActionExecutorProps {
  flow: Flow;
  stepNumber: number;
}
