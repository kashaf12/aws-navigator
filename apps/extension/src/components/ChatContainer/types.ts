export interface ChatContainerProps {
  initialMessage?: string;
  className?: string;
  onHighlight?: (selectors: string[]) => void;
}
