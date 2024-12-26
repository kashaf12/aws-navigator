import { createContext, useState, useEffect } from "react";
import { AssistantState, Chat, Message, MessageStatus } from "@/types";
import { LocalStorageManager, MockChat } from "@/services";
import { ChatContextType, ChatProviderProps } from "./types";
import { sortChats, generateChatName } from "@/utils/chats";

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
const storageManager = new LocalStorageManager();
const chatService = new MockChat();

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [assistantState, setAssistantState] = useState<AssistantState>({
    status: MessageStatus.IDLE,
  });

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

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const currentChat = activeChat || {
      id: crypto.randomUUID(),
      name: generateChatName(content),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    const userMessage: Message = {
      id: currentChat?.messages?.length + 1,
      type: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...(currentChat?.messages || []), userMessage];
    await addOrUpdateChat({
      ...currentChat,
      messages: updatedMessages,
      updatedAt: new Date(),
    });

    setAssistantState({ status: MessageStatus.PENDING });

    try {
      const response = await chatService.sendMessage(content);

      if (!response.success) {
        setAssistantState({
          status: MessageStatus.ERROR,
          error: response.error,
        });
        return;
      }

      const assistantMessage: Message = {
        id: currentChat.messages.length + 2,
        type: "assistant",
        content: response?.content || "No response content",
        timestamp: new Date(),
        tasks: response.tasks,
      };

      await addOrUpdateChat({
        ...currentChat,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date(),
      });

      setAssistantState({ status: MessageStatus.IDLE });
    } catch (error) {
      console.error("Error getting response:", error);
      setAssistantState({
        status: MessageStatus.ERROR,
        error: {
          message: "Failed to get response. Please try again.",
          code: "CHAT_ERROR",
        },
      });
    }
  };

  const retryLastMessage = async () => {
    if (!activeChat?.messages.length) return;

    const lastUserMessage = [...activeChat.messages]
      .reverse()
      .find((msg) => msg.type === "user");

    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        assistantState,
        sendMessage,
        retryLastMessage,
        addOrUpdateChat,
        deleteChat,
        updateActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
