import { useCallback } from "react";
import { ConversationListProps } from "./types";
import classes from "./styles.module.css";

const ConversationList = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewChat,
  onDelete,
}: ConversationListProps) => {
  const formatDate = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  }, []);

  return (
    <div className={classes.container}>
      <button onClick={onNewChat} className={classes.newChatButton}>
        + New Chat
      </button>

      <div className={classes.list}>
        {conversations.map((conversation) => (
          <div key={conversation.id} className={classes.conversationWrapper}>
            <button
              onClick={() => onConversationSelect(conversation.id)}
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
              onClick={() => onDelete(conversation.id)}
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
