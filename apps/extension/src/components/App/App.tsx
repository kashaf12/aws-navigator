import { useState, useEffect } from "react";
import { isAWSConsole } from "@/utils/aws-detection";
import { ConversationStore } from "@/types/chat";
import {
  getInitialStore,
  createNewConversation,
  addConversation,
  deleteConversation,
} from "@/utils/conversation-storage";
import NotAWSWarning from "../NotAWSWarning";
import ErrorMessage from "../ErrorMessage";
import ChatContainer from "../ChatContainer";
import ConversationList from "../ConversationList";
import classes from "./styles.module.css";

const INITIAL_MESSAGE =
  "Hello! I'm your AWS Navigator assistant. How can I help you today?";

const App = () => {
  const [isAWS, setIsAWS] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [conversationStore, setConversationStore] =
    useState<ConversationStore>(getInitialStore());

  useEffect(() => {
    console.log("[AWS Navigator] Popup Opened");

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const url = currentTab?.url || "";
        console.log("[AWS Navigator] Current Tab URL:", url);

        const isAWSTab = isAWSConsole(url);
        console.log("[AWS Navigator] Is AWS Console Tab:", isAWSTab);

        setIsAWS(isAWSTab);
        setLoading(false);

        // Create initial conversation if none exists
        if (isAWSTab && conversationStore.conversations.length === 0) {
          handleNewChat();
        }
      });

      // Example of sending message to background
      chrome.runtime.sendMessage({ type: "POPUP_OPENED" }, (response) =>
        console.log("[AWS Navigator] Background Response:", response)
      );
    } catch (err) {
      console.error("[AWS Navigator] Popup Error:", err);
      setError(true);
      setLoading(false);
    }

    return () => {
      console.log("[AWS Navigator] Popup Closed");
    };
  }, []);

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
  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage />;
  }

  const activeConversation = conversationStore.conversations.find(
    (conv) => conv.id === conversationStore.activeConversationId
  );

  return (
    <div className={classes.appContainer}>
      {isAWS ? (
        <>
          <header className={classes.appHeader}>
            <h1 className={classes.appTitle}>AWS Navigator</h1>
          </header>
          <main className={classes.appMain}>
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
          </main>
        </>
      ) : (
        <NotAWSWarning />
      )}
    </div>
  );
};

export default App;
