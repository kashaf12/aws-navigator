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
import { ChatStatus } from "@/types";

const ChatContainer = ({
  chat,
  className = "",
  onHighlight,
  onSend,
}: ChatContainerProps) => {
  const messagesEndRef = useAutoScroll([chat?.updatedAt]);
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
          {chat?.status === ChatStatus.PENDING && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <ChatEmptyState />
      )}
      <ChatInput
        onSendMessage={onSend}
        disabled={chat?.status === ChatStatus.PENDING}
        ref={inputRef}
      />
    </div>
  );
};

export default ChatContainer;
