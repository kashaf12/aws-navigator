import { ViewType } from "@/contexts";
import classes from "./styles.module.css";
import { formatDate } from "@/utils/utils";
import { useView } from "@/hooks";

const ConversationList = () => {
  const { setActiveView } = useView();
  const {
    conversations,
    activeConversationId,
    updateActiveConversation,
    deleteConversation,
  } = useConversations();
  return (
    <div className={classes.container}>
      {conversations.length > 0 ? (
        <div className={classes.list}>
          {conversations.map((conversation) => (
            <div key={conversation.id} className={classes.conversationWrapper}>
              <button
                onClick={() => {
                  updateActiveConversation(conversation.id);
                  setActiveView(ViewType.CurrentChat);
                }}
                className={`${classes.conversationItem} ${
                  conversation.id === activeConversationId ? classes.active : ""
                }`}
              >
                <div className={classes.conversationInfo}>
                  <span className={classes.conversationName}>
                    {conversation.name}
                  </span>
                  <span className={classes.timestamp}>
                    {formatDate(conversation.updatedAt)}
                  </span>
                </div>
              </button>
              <button
                onClick={() => deleteConversation(conversation.id)}
                className={classes.deleteButton}
                aria-label="Delete conversation"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyState}>
          <i>
            No conversations yet. Please create a conversation to get started.
          </i>
          <button
            onClick={() => setActiveView(ViewType.CurrentChat)}
            className={classes.newChatButton}
          >
            Start New Conversation
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
