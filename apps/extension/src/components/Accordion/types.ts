import { ReactNode } from "react";

export interface AccordionProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}
