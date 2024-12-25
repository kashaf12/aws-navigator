import { LocalStorageManager } from "@/storage";
import { Conversation } from "@/types/chat";
import { useState, useEffect } from "react";

// const storageManager = new HybridStorageManager(
//   new LocalStorageManager(),
//   new BackendManager()
// );

const storageManager = new LocalStorageManager();

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadData = async () => {
      const convs = await storageManager.getConversations();
      const activeId = await storageManager.getActiveConversationId();
      setConversations(sortConversations(convs));
      setActiveConversationId(activeId);
    };
    loadData();
  }, []);

  const sortConversations = (convs: Conversation[]): Conversation[] => {
    return convs.sort((a, b) => {
      const updatedAtComparison =
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (updatedAtComparison !== 0) {
        return updatedAtComparison; // Sort by updatedAt first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then by createdAt
    });
  };

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

  return {
    conversations,
    activeConversationId,
    updateActiveConversation,
    addOrUpdateConversation,
    deleteConversation,
  };
};

export default useConversations;
