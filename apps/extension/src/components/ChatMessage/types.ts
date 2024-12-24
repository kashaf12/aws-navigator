import { Message } from "@/types/chat";
import { Task } from "@aws-navigator/schemas";

export interface ChatMessageProps {
  message: Message;
  onStartTask?: (task: Task) => void;
}
