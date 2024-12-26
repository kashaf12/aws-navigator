import { Chat } from "@/types/chat";

export interface ChatContainerProps {
  chat?: Chat;
  className?: string;
  onHighlight?: (selectors: string[]) => void;
  onSend: (message: string) => void;
}
