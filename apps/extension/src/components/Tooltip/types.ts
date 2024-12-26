import { ReactNode } from "react";
import { PositionType } from "../Navigation";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: PositionType;
  delay?: number;
}
