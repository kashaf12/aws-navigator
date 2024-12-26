import classes from "./styles.module.css";

const ChatEmptyState = () => {
  return (
    <div className={classes.messagesContainer}>
      <div className={classes.emptyState}>
        <h2>Welcome to AWS Navigator</h2>
        <p>
          Let me guide you through AWS tasks by highlighting key elements in the
          browser.
        </p>
        <p>No chat selected. Select one from your history.</p>
        <p>Alternatively, Ask an AWS question</p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
