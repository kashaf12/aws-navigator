import { Task } from "@aws-navigator/schemas";

export enum MessageStatus {
  IDLE = "idle",
  PENDING = "pending",
  ERROR = "error",
}

export interface Step {
  id: string;
  description: string;
  selector?: string;
}

export interface StepsResponse {
  type: "steps";
  steps: Step[];
  message: string;
}

export interface ChatResponse {
  type: "chat";
  message: string;
}

export interface MessageError {
  message: string;
  code?: string;
}

export interface AssistantState {
  status: MessageStatus;
  error?: MessageError;
}
export interface Message {
  id: number;
  type: MessageType;
  content: string;
  timestamp: Date;
  steps?: Step[];
}

export type MessageType = "user" | "assistant";

export interface Message {
  id: number;
  type: MessageType;
  content: string; // Can contain markdown
  timestamp: Date;
  tasks?: Task[];
}

export interface BackendResponse {
  success: boolean;
  error?: MessageError;
  content?: string; // Markdown content with references
  tasks?: Task[]; // Optional tasks array
}

export interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
}
