import { Conversation } from "@/types/chat";

export interface ChatContainerProps {
  conversation?: Conversation;
  className?: string;
  onHighlight?: (selectors: string[]) => void;
  onSend: (message: string) => void;
  isTyping?: boolean;
}
