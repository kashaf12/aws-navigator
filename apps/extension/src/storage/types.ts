import { Conversation } from "@/types/chat";

export interface StorageManager {
  getConversations(): Promise<Conversation[]>;
  addOrUpdateConversation(conversation: Conversation): Promise<void>;
  deleteConversation(conversationId: string): Promise<void>;

  getActiveConversationId(): Promise<string | null>;
  setActiveConversationId(conversationId: string | null): Promise<void>;
}
