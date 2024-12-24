import { Conversation } from "@/types/chat";

export interface ChatContainerProps {
  conversation: Conversation;
  className?: string;
  onHighlight?: (selectors: string[]) => void;
  onUpdate: (updatedConversation: Conversation) => void;
}
