import { Task } from "@aws-navigator/schemas";

export enum MessageType {
  USER = "user",
  ASSISTANT = "assistant",
}

export enum ChatStatus {
  IDLE = "idle",
  PENDING = "pending",
}

export interface MessageError {
  message: string;
  code?: string;
}

export interface Message {
  id: number;
  type: MessageType;
  content: string;
  timestamp: Date;
  tasks?: Task[];
  error?: MessageError;
}

export interface BackendResponse {
  success: boolean;
  error?: MessageError;
  content?: string;
  tasks?: Task[];
}

export interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  status: ChatStatus;
}
