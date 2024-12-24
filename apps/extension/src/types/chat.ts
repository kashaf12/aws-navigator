import { Task } from "@aws-navigator/schemas";

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

export interface ConversationResponse {
  type: "conversation";
  message: string;
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
  content: string; // Markdown content with references
  tasks?: Task[]; // Optional tasks array
}
