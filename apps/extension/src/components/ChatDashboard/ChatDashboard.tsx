import ChatContainer from "../ChatContainer";
import ConversationEmptyState from "../ConversationEmptyState";
import ConversationList from "../ConversationList";
import classes from "./styles.module.css";
import { useConversations } from "@/hooks";

const ChatDashboard = () => {
  const {
    conversations,
    addOrUpdateConversation,
    deleteConversation,
    activeConversationId,
    updateActiveConversation,
  } = useConversations();

  const [syncing, setSyncing] = useState(false);

  const handleAddConversation = async () => {
    setSyncing(true);
    const newConversation = {
      id: crypto.randomUUID(),
      name: "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    await addOrUpdateConversation(newConversation);
    await updateActiveConversation(newConversation.id);
    setSyncing(false);
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

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  return (
    <>
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={updateActiveConversation}
        onNewChat={handleAddConversation}
        onDelete={deleteConversation}
        syncing={syncing}
      />
      <div className={classes.contentArea}>
        {activeConversation ? (
          <ChatContainer
            conversation={activeConversation}
            onHighlight={handleHighlight}
            onUpdate={addOrUpdateConversation}
          />
        ) : (
          <ConversationEmptyState
            onNewChat={handleAddConversation}
            isConversationListEmpty={conversations.length === 0}
          />
        )}
      </div>
    </>
  );
};

export default ChatDashboard;
