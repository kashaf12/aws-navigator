import { Conversation } from "@/types/chat";
import { StorageManager } from "../types";

class LocalStorageManager implements StorageManager {
  private CONVERSATIONS_KEY = CONVERSATIONS_STORAGE_KEY;
  private ACTIVE_CONVERSATION_KEY = ACTIVE_CONVERSATION_STORAGE_KEY;

  async getConversations(): Promise<Conversation[]> {
    const data = localStorage.getItem(this.CONVERSATIONS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data, (key, value) => {
      if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
        return new Date(value);
      }
      return value;
    });

    return parsed;
  }

  async addOrUpdateConversation(conversation: Conversation) {
    const conversations = await this.getConversations();
    const updatedConversations = conversations.map((c) =>
      c.id === conversation.id ? { ...c, ...conversation } : c
    );
    if (!updatedConversations.find((c) => c.id === conversation.id)) {
      updatedConversations.push(conversation);
    }
    localStorage.setItem(
      this.CONVERSATIONS_KEY,
      JSON.stringify(updatedConversations)
    );
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const conversations = await this.getConversations();
    const updated = conversations.filter((c) => c.id !== conversationId);
    localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(updated));
  }

  async getActiveConversationId(): Promise<string | null> {
    return localStorage.getItem(this.ACTIVE_CONVERSATION_KEY);
  }

  async setActiveConversationId(conversationId: string | null): Promise<void> {
    if (conversationId) {
      localStorage.setItem(this.ACTIVE_CONVERSATION_KEY, conversationId);
    } else {
      localStorage.removeItem(this.ACTIVE_CONVERSATION_KEY);
    }
  }
}

export default LocalStorageManager;
