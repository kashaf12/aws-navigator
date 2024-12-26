import { Chat } from "@/types";

export interface StorageManager {
  getChats(): Promise<Chat[]>;
  addOrUpdateChat(chat: Chat): Promise<void>;
  deleteChat(chatId: string): Promise<void>;

  getActiveChatId(): Promise<string | null>;
  setActiveChatId(chatId: string | null): Promise<void>;
}
