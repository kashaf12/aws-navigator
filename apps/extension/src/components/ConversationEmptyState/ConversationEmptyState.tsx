import classes from "./styles.module.css";
import { ConversationEmptyStateProps } from "./types";

const ConversationEmptyState = ({
  onNewChat,
  isConversationListEmpty = false,
}: ConversationEmptyStateProps) => {
  return (
    <div className={classes.ConversationEmptyState}>
      <div className={classes.messagesContainer}>
        <div className={classes.emptyState}>
          <h2>Welcome to AWS Navigator</h2>
          <p>
            Let me guide you through AWS tasks by highlighting key elements in
            the browser.
          </p>
          {!isConversationListEmpty && (
            <p>No conversation selected. Select one from your history.</p>
          )}
          <p>Alternatively, start a new chat now:</p>
          <button onClick={onNewChat} className={classes.newChatButton}>
            Start New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationEmptyState;
