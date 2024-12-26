import { Chat } from "@/types";
import { ReactNode } from "react";

export interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  activeChat?: Chat;
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (messageId: number) => Promise<void>;
  addOrUpdateChat: (chat: Chat) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  updateActiveChat: (id: string | null) => Promise<void>;
}

export interface ChatProviderProps {
  children: ReactNode;
}
