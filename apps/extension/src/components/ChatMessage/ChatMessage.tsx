import classes from "./styles.module.css";
import { ChatMessageProps } from "./types";

const ChatMessage = ({ message, onHighlight }: ChatMessageProps) => {
  console.log({ message });
  return (
    <div className={`${classes.messageWrapper} ${classes[`${message.type}`]}`}>
      <div className={classes.messageContent}>
        <p className={classes.messageText}>{message.content}</p>

        {message.steps && (
          <div className={classes.stepsContainer}>
            <ol className={classes.stepsList}>
              {message.steps.map((step) => (
                <li key={step.id} className={classes.stepItem}>
                  {step.description}
                </li>
              ))}
            </ol>

            <button
              onClick={() => onHighlight?.(message.steps!)}
              className={classes.highlightButton}
            >
              Highlight on Browser
            </button>
          </div>
        )}

        <span className={classes.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
