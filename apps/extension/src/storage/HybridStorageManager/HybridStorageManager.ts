import { Conversation } from "@/types/chat";
import { BackendManager } from "../BackendManager";
import { LocalStorageManager } from "../LocalStorageManager";
import { StorageManager } from "../types";

class HybridStorageManager implements StorageManager {
  constructor(
    private localManager: LocalStorageManager,
    private backendManager: BackendManager
  ) {}

  async getConversations(): Promise<Conversation[]> {
    try {
      const conversations = await this.backendManager.getConversations();
      for (const conversation of conversations) {
        await this.localManager.addOrUpdateConversation(conversation);
      }
      return conversations;
    } catch {
      return this.localManager.getConversations();
    }
  }

  async addOrUpdateConversation(conversation: Conversation): Promise<void> {
    await this.localManager.addOrUpdateConversation(conversation);
    try {
      await this.backendManager.addOrUpdateConversation(conversation);
    } catch (error) {
      console.error("Failed to sync conversation with backend", error);
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.localManager.deleteConversation(conversationId);
    try {
      await this.backendManager.deleteConversation(conversationId);
    } catch (error) {
      console.error("Failed to delete conversation from backend", error);
    }
  }

  async getActiveConversationId(): Promise<string | null> {
    try {
      const activeId = await this.backendManager.getActiveConversationId();
      await this.localManager.setActiveConversationId(activeId);
      return activeId;
    } catch {
      return this.localManager.getActiveConversationId();
    }
  }

  async setActiveConversationId(conversationId: string | null): Promise<void> {
    await this.localManager.setActiveConversationId(conversationId);
    try {
      await this.backendManager.setActiveConversationId(conversationId);
    } catch (error) {
      console.error(
        "Failed to sync active conversation ID with backend",
        error
      );
    }
  }
}

export default HybridStorageManager;
