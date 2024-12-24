import { ChatMessageProps } from "./types";
import classes from "./styles.module.css";
import MarkdownContent from "../MarkdownContent";
import TaskList from "../TaskList";
import Timestamp from "../Timestamp";

const ChatMessage = ({
  message,
  onStartTask = () => null,
}: ChatMessageProps) => {
  return (
    <div className={`${classes.messageWrapper} ${classes[`${message.type}`]}`}>
      <div className={classes.messageContent}>
        <div className={classes.messageText}>
          <MarkdownContent content={message.content} />
        </div>

        {message.tasks && message.tasks.length > 0 && (
          <TaskList tasks={message.tasks} onStartTask={onStartTask} />
        )}

        <Timestamp date={message.timestamp} />
      </div>
    </div>
  );
};

export default ChatMessage;
