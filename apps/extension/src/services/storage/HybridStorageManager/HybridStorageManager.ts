import { Chat } from "@/types";
import { BackendManager } from "../BackendManager";
import { LocalStorageManager } from "../LocalStorageManager";
import { StorageManager } from "../types";

class HybridStorageManager implements StorageManager {
  constructor(
    private localManager: LocalStorageManager,
    private backendManager: BackendManager
  ) {}

  async getChats(): Promise<Chat[]> {
    try {
      const chats = await this.backendManager.getChats();
      for (const chat of chats) {
        await this.localManager.addOrUpdateChat(chat);
      }
      return chats;
    } catch {
      return this.localManager.getChats();
    }
  }

  async addOrUpdateChat(chat: Chat): Promise<void> {
    await this.localManager.addOrUpdateChat(chat);
    try {
      await this.backendManager.addOrUpdateChat(chat);
    } catch (error) {
      console.error("Failed to sync chat with backend", error);
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.localManager.deleteChat(chatId);
    try {
      await this.backendManager.deleteChat(chatId);
    } catch (error) {
      console.error("Failed to delete chat from backend", error);
    }
  }

  async getActiveChatId(): Promise<string | null> {
    try {
      const activeId = await this.backendManager.getActiveChatId();
      await this.localManager.setActiveChatId(activeId);
      return activeId;
    } catch {
      return this.localManager.getActiveChatId();
    }
  }

  async setActiveChatId(chatId: string | null): Promise<void> {
    await this.localManager.setActiveChatId(chatId);
    try {
      await this.backendManager.setActiveChatId(chatId);
    } catch (error) {
      console.error("Failed to sync active chat ID with backend", error);
    }
  }
}

export default HybridStorageManager;
