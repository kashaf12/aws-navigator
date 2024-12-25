import { Conversation } from "@/types";
import { ReactNode } from "react";

export interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  addOrUpdateConversation: (conversation: Conversation) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateActiveConversation: (id: string | null) => Promise<void>;
}

export interface ConversationProviderProps {
  children: ReactNode;
}
