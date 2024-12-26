import { Chat } from "@/types";
import { StorageManager } from "../types";

class BackendManager implements StorageManager {
  private BASE_URL = "http://localhost:3000/chats";
  private ACTIVE_CHAT_URL = "http://localhost:3000/activeChat";

  async getChats(): Promise<Chat[]> {
    const response = await fetch(this.BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch chats");
    return response.json();
  }

  async addOrUpdateChat(chat: Chat): Promise<void> {
    await fetch(`${this.BASE_URL}/${chat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chat),
    });
  }

  async deleteChat(chatId: string): Promise<void> {
    await fetch(`${this.BASE_URL}/${chatId}`, { method: "DELETE" });
  }

  async getActiveChatId(): Promise<string | null> {
    const response = await fetch(this.ACTIVE_CHAT_URL);
    if (!response.ok) throw new Error("Failed to fetch active chat ID");
    const data = await response.json();
    return data.activeChatId || null;
  }

  async setActiveChatId(chatId: string | null): Promise<void> {
    await fetch(this.ACTIVE_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeChatId: chatId }),
    });
  }
}

export default BackendManager;
