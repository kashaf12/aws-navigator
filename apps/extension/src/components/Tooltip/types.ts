import { ReactNode } from "react";

export type Position = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: Position;
  delay?: number;
}
