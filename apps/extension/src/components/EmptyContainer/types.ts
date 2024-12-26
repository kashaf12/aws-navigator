import { ComponentType } from "react";

export interface EmptyContainerProps {
  Icon?: ComponentType<{ size: number; className: string }>;
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
}
