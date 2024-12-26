import { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import { ChatContainerProps } from "./types";
import ChatInput from "../ChatInput";
import { Task } from "@aws-navigator/schemas";
import ChatEmptyState from "../ChatEmptyState";
import { extractUniqueSelectors } from "@/utils/utils";
import { useAutoScroll } from "@/hooks";
import { MessageStatus } from "@/types";
import { RotateCcw } from "lucide-react";

const ChatContainer = ({
  chat,
  className = "",
  onHighlight,
  onSend,
  onRetry,
  assistantState,
}: ChatContainerProps) => {
  const messagesEndRef = useAutoScroll([chat?.messages, assistantState]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chat]);

  const handleHighlight = (task: Task) => {
    const uniqueSelectors = extractUniqueSelectors(task);
    if (uniqueSelectors.length > 0 && onHighlight) {
      onHighlight(uniqueSelectors);
    }
  };

  return (
    <div className={`${classes.chatContainer} ${className}`}>
      {chat ? (
        <div className={classes.messagesContainer}>
          {chat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onStartTask={handleHighlight}
            />
          ))}
          {assistantState.status === MessageStatus.PENDING && (
            <TypingIndicator />
          )}
          {assistantState.status === MessageStatus.ERROR && (
            <div className={classes.errorContainer}>
              <ErrorMessage
                message={
                  assistantState.error?.message || "Something went wrong"
                }
              />
              <button onClick={onRetry} className={classes.retryButton}>
                <RotateCcw size={20} />
                Retry
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <ChatEmptyState />
      )}
      <ChatInput
        onSendMessage={onSend}
        disabled={assistantState.status === MessageStatus.PENDING}
        ref={inputRef}
      />
    </div>
  );
};

export default ChatContainer;
