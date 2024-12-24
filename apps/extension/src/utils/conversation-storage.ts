import { Conversation, ConversationStore, Message } from "@/types/chat";

const STORAGE_KEY = "aws_navigator_conversations";
const MAX_CONVERSATIONS = 10;

export const getInitialStore = (): ConversationStore => {
  const defaultStore: ConversationStore = {
    conversations: [],
    activeConversationId: null,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultStore;

    const parsed = JSON.parse(stored, (key, value) => {
      // Convert date strings back to Date objects
      if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
        return new Date(value);
      }
      return value;
    });

    return parsed;
  } catch (error) {
    console.error("Error loading conversations:", error);
    return defaultStore;
  }
};

export const saveStore = (store: ConversationStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving conversations:", error);
  }
};

export const createNewConversation = (firstMessage: string): Conversation => {
  return {
    id: crypto.randomUUID(),
    name: generateConversationName(firstMessage),
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: 1,
        type: "assistant",
        content: firstMessage,
        timestamp: new Date(),
      },
    ],
  };
};

export const deleteConversation = (
  store: ConversationStore,
  conversationId: string
): ConversationStore => {
  const updatedConversations = store.conversations.filter(
    (conv) => conv.id !== conversationId
  );

  const updatedStore = {
    conversations: updatedConversations,
    activeConversationId: updatedConversations[0]?.id || null,
  };

  saveStore(updatedStore);
  return updatedStore;
};

export const addConversation = (
  store: ConversationStore,
  conversation: Conversation
): ConversationStore => {
  const updatedConversations = [conversation, ...store.conversations].slice(
    0,
    MAX_CONVERSATIONS
  );

  const updatedStore = {
    ...store,
    conversations: updatedConversations,
    activeConversationId: conversation.id,
  };

  saveStore(updatedStore);
  return updatedStore;
};

export const updateConversation = (
  store: ConversationStore,
  conversationId: string,
  messages: Message[]
): ConversationStore => {
  const updatedConversations = store.conversations.map((conv) =>
    conv.id === conversationId
      ? {
          ...conv,
          messages,
          updatedAt: new Date(),
        }
      : conv
  );

  const updatedStore = {
    ...store,
    conversations: updatedConversations,
  };

  saveStore(updatedStore);
  return updatedStore;
};

const generateConversationName = (firstMessage: string): string => {
  const name = firstMessage.slice(0, 30);
  return name.length < firstMessage.length ? `${name}...` : name;
};
