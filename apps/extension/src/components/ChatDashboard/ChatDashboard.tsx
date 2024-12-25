import { useState } from "react";
import { ConversationStore } from "@/types/chat";
import {
  getInitialStore,
  createNewConversation,
  addConversation,
  deleteConversation,
} from "@/utils/conversation-storage";
import ChatContainer from "../ChatContainer";
import ConversationList from "../ConversationList";
import classes from "./styles.module.css";

const INITIAL_MESSAGE =
  "Hello! I'm your AWS Navigator assistant. How can I help you today?";

const ChatDashboard = () => {
  const [conversationStore, setConversationStore] =
    useState<ConversationStore>(getInitialStore());

  const handleNewChat = () => {
    const newConversation = createNewConversation(INITIAL_MESSAGE);
    const updatedStore = addConversation(conversationStore, newConversation);
    setConversationStore(updatedStore);
  };

  const handleConversationSelect = (conversationId: string) => {
    setConversationStore((prev) => ({
      ...prev,
      activeConversationId: conversationId,
    }));
  };

  const handleHighlight = (selectors: string[]) => {
    // Implement your highlighting logic here
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Add highlighting effect
      }
    });
  };

  const handleDeleteConversation = (conversationId: string) => {
    const updatedStore = deleteConversation(conversationStore, conversationId);
    setConversationStore(updatedStore);
  };

  const activeConversation = conversationStore.conversations.find(
    (conv) => conv.id === conversationStore.activeConversationId
  );

  return (
    <>
      <ConversationList
        conversations={conversationStore.conversations}
        activeConversationId={conversationStore.activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />
      <div className={classes.contentArea}>
        {activeConversation && (
          <ChatContainer
            conversation={activeConversation}
            onHighlight={handleHighlight}
            onUpdate={(updatedConversation) => {
              setConversationStore((prev) => ({
                ...prev,
                conversations: prev.conversations.map((conv) =>
                  conv.id === updatedConversation.id
                    ? updatedConversation
                    : conv
                ),
              }));
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChatDashboard;
