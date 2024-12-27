import { Chat } from "@/types";
import { StorageManager } from "../types";
import { CHATS_STORAGE_KEY, ACTIVE_CHAT_STORAGE_KEY } from "@/utils";

class LocalStorageManager implements StorageManager {
  private CHATS_KEY = CHATS_STORAGE_KEY;
  private ACTIVE_CHAT_KEY = ACTIVE_CHAT_STORAGE_KEY;

  async getChats(): Promise<Chat[]> {
    const data = localStorage.getItem(this.CHATS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data, (key, value) => {
      if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
        return new Date(value);
      }
      return value;
    });

    return parsed;
  }

  async addOrUpdateChat(chat: Chat) {
    const chats = await this.getChats();
    const updatedChats = chats.map((c) =>
      c.id === chat.id ? { ...c, ...chat } : c,
    );
    if (!updatedChats.find((c) => c.id === chat.id)) {
      updatedChats.push(chat);
    }
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(updatedChats));
  }

  async deleteChat(chatId: string): Promise<void> {
    const chats = await this.getChats();
    const updated = chats.filter((c) => c.id !== chatId);
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(updated));
  }

  async getActiveChatId(): Promise<string | null> {
    return localStorage.getItem(this.ACTIVE_CHAT_KEY);
  }

  async setActiveChatId(chatId: string | null): Promise<void> {
    if (chatId) {
      localStorage.setItem(this.ACTIVE_CHAT_KEY, chatId);
    } else {
      localStorage.removeItem(this.ACTIVE_CHAT_KEY);
    }
  }
}

export default LocalStorageManager;
