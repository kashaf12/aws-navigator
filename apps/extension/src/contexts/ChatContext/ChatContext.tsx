import { createContext, useState, useEffect } from "react";
import { Chat, ChatStatus, Message, MessageType } from "@/types";
import { ChatLocalStorageManager, MockChat } from "@/services";
import { ChatContextType, ChatProviderProps } from "./types";
import { sortChats, generateChatName } from "@/utils";

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);
const storageManager = new ChatLocalStorageManager();
const chatService = new MockChat();

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      const savedChats = await storageManager.getChats();
      const activeChatId = await storageManager.getActiveChatId();
      setChats(sortChats(savedChats));
      setActiveChatId(activeChatId);
    };
    loadChats();
  }, []);

  const updateActiveChat = async (chatId: string | null) => {
    setActiveChatId(chatId);
    await storageManager.setActiveChatId(chatId);
  };

  const addOrUpdateChat = async (chat: Chat) => {
    console.log("[AWS Navigator]", chat);
    await storageManager.addOrUpdateChat(chat);
    const updated = await storageManager.getChats();
    setChats(sortChats(updated));
  };

  const deleteChat = async (chatId: string) => {
    await storageManager.deleteChat(chatId);
    const updated = await storageManager.getChats();
    setChats(sortChats(updated));

    if (chatId === activeChatId) {
      await updateActiveChat(null);
    }
  };

  const activeChat = chats.find((conv) => conv.id === activeChatId);

  const handleOnAddUpdateChat = async (chat: Chat) => {
    await addOrUpdateChat(chat);
    await updateActiveChat(chat.id);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const currentChat = activeChat || {
      id: crypto.randomUUID(),
      name: generateChatName(content),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      status: ChatStatus.IDLE,
    };

    if (currentChat.status === ChatStatus.PENDING) return;

    const userMessage: Message = {
      id: currentChat?.messages?.length + 1,
      type: MessageType.USER,
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...(currentChat?.messages || []), userMessage];

    await handleOnAddUpdateChat({
      ...currentChat,
      messages: updatedMessages,
      status: ChatStatus.PENDING,
      updatedAt: new Date(),
    });

    try {
      const response = await chatService.sendMessage(content);

      const assistantMessage: Message = {
        id: updatedMessages.length + 1,
        type: MessageType.ASSISTANT,
        content: response?.content || "No response content",
        timestamp: new Date(),
        tasks: response.tasks,
        error: response.error,
      };

      await handleOnAddUpdateChat({
        ...currentChat,
        messages: [...updatedMessages, assistantMessage],
        status: ChatStatus.IDLE,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("[AWS Navigator] Error getting response:", error);

      const errorMessage: Message = {
        id: updatedMessages.length + 1,
        type: MessageType.ASSISTANT,
        content: "An error occurred while processing your request.",
        timestamp: new Date(),
        error: {
          message: "Failed to get response. Please try again.",
          code: "CHAT_ERROR",
        },
      };

      await handleOnAddUpdateChat({
        ...currentChat,
        messages: [...updatedMessages, errorMessage],
        status: ChatStatus.IDLE,
        updatedAt: new Date(),
      });
    }
  };

  const retryMessage = async (messageId: number) => {
    if (!activeChat || activeChat.status === ChatStatus.PENDING) return;

    const messageIndex = activeChat.messages.findIndex(
      (m) => m.id === messageId,
    );
    if (messageIndex <= 0) return;

    const userMessage = activeChat.messages[messageIndex - 1];
    if (userMessage.type !== "user") return;

    const messages = activeChat.messages.filter((m) => m.id !== messageId);

    await addOrUpdateChat({
      ...activeChat,
      messages,
      updatedAt: new Date(),
    });

    await sendMessage(userMessage.content);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        sendMessage,
        retryMessage,
        addOrUpdateChat,
        deleteChat,
        updateActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
