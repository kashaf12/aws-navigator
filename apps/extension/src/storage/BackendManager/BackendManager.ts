import { Conversation } from "@/types/chat";
import { StorageManager } from "../types";

class BackendManager implements StorageManager {
  private BASE_URL = "http://localhost:3000/conversations";
  private ACTIVE_CONVERSATION_URL = "http://localhost:3000/activeConversation";

  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(this.BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  }

  async addOrUpdateConversation(conversation: Conversation): Promise<void> {
    await fetch(`${this.BASE_URL}/${conversation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conversation),
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await fetch(`${this.BASE_URL}/${conversationId}`, { method: "DELETE" });
  }

  async getActiveConversationId(): Promise<string | null> {
    const response = await fetch(this.ACTIVE_CONVERSATION_URL);
    if (!response.ok) throw new Error("Failed to fetch active conversation ID");
    const data = await response.json();
    return data.activeConversationId || null;
  }

  async setActiveConversationId(conversationId: string | null): Promise<void> {
    await fetch(this.ACTIVE_CONVERSATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeConversationId: conversationId }),
    });
  }
}

export default BackendManager;
