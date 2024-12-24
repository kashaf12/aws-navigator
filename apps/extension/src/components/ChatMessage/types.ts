import { Message, Step } from "@/types/chat";

export interface ChatMessageProps {
  message: Message;
  onHighlight?: (steps: Step[]) => void;
}
