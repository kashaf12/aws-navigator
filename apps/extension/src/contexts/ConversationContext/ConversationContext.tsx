import { createContext, useState, useEffect } from "react";
import { Conversation } from "@/types";
import { LocalStorageManager } from "@/storage";
import { ConversationContextType, ConversationProviderProps } from "./types";
import { sortConversations } from "@/utils/conversations";

export const ConversationContext = createContext<
  ConversationContextType | undefined
>(undefined);
const storageManager = new LocalStorageManager();

export const ConversationProvider = ({
  children,
}: ConversationProviderProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadConversations = async () => {
      const savedConversation = await storageManager.getConversations();
      const activeConversationId =
        await storageManager.getActiveConversationId();
      setConversations(sortConversations(savedConversation));
      setActiveConversationId(activeConversationId);
    };
    loadConversations();
  }, []);

  const updateActiveConversation = async (conversationId: string | null) => {
    setActiveConversationId(conversationId);
    await storageManager.setActiveConversationId(conversationId);
  };

  const addOrUpdateConversation = async (conversation: Conversation) => {
    console.log("[AWS Navigator]", conversation);
    await storageManager.addOrUpdateConversation(conversation);
    const updated = await storageManager.getConversations();
    setConversations(sortConversations(updated));
  };

  const deleteConversation = async (conversationId: string) => {
    await storageManager.deleteConversation(conversationId);
    const updated = await storageManager.getConversations();
    setConversations(sortConversations(updated));

    if (conversationId === activeConversationId) {
      await updateActiveConversation(null);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        addOrUpdateConversation,
        deleteConversation,
        updateActiveConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
