import classes from "./styles.module.css";
import { formatDate } from "@/utils/utils";

const ConversationList = () => {
  const {
    conversations,
    activeConversationId,
    updateActiveConversation,
    deleteConversation,
  } = useConversations();
  return (
    <div className={classes.container}>
      <button
        onClick={() => updateActiveConversation(null)}
        className={classes.newChatButton}
      >
        New Chat
      </button>
      <div className={classes.list}>
        {conversations.map((conversation) => (
          <div key={conversation.id} className={classes.conversationWrapper}>
            <button
              onClick={() => updateActiveConversation(conversation.id)}
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
    </div>
  );
};

export default ConversationList;
