import { Chat } from "@/types";
import { ChatStorageManager } from "../types";
import { ChatLocalStorageManager } from "../local";
import { ChatBackendManager } from "../backend";

class ChatHybridStorageManager implements ChatStorageManager {
  constructor(
    private localManager: ChatLocalStorageManager,
    private ChatBackendManager: ChatBackendManager,
  ) {}

  async getChats(): Promise<Chat[]> {
    try {
      const chats = await this.ChatBackendManager.getChats();
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
      await this.ChatBackendManager.addOrUpdateChat(chat);
    } catch (error) {
      console.error("[AWS Navigator] Failed to sync chat with backend", error);
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.localManager.deleteChat(chatId);
    try {
      await this.ChatBackendManager.deleteChat(chatId);
    } catch (error) {
      console.error(
        "[AWS Navigator] Failed to delete chat from backend",
        error,
      );
    }
  }

  async getActiveChatId(): Promise<string | null> {
    try {
      const activeId = await this.ChatBackendManager.getActiveChatId();
      await this.localManager.setActiveChatId(activeId);
      return activeId;
    } catch {
      return this.localManager.getActiveChatId();
    }
  }

  async setActiveChatId(chatId: string | null): Promise<void> {
    await this.localManager.setActiveChatId(chatId);
    try {
      await this.ChatBackendManager.setActiveChatId(chatId);
    } catch (error) {
      console.error(
        "[AWS Navigator] Failed to sync active chat ID with backend",
        error,
      );
    }
  }
}

export default ChatHybridStorageManager;
