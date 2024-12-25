import { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import { ChatContainerProps } from "./types";
import ChatInput from "../ChatInput";
import { Task } from "@aws-navigator/schemas";
import ConversationEmptyState from "../ConversationEmptyState";
import { extractUniqueSelectors } from "@/utils/utils";
import { useAutoScroll } from "@/hooks";

const ChatContainer = ({
  conversation,
  className = "",
  onHighlight,
  onSend,
  isTyping = false,
}: ChatContainerProps) => {
  const messagesEndRef = useAutoScroll(conversation?.messages);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation]);

  const handleHighlight = (task: Task) => {
    const uniqueSelectors = extractUniqueSelectors(task);
    if (uniqueSelectors.length > 0 && onHighlight) {
      onHighlight(uniqueSelectors);
    }
  };

  return (
    <div className={`${classes.chatContainer} ${className}`}>
      {conversation ? (
        <div className={classes.messagesContainer}>
          {conversation?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onStartTask={handleHighlight}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <ConversationEmptyState />
      )}
      <ChatInput onSendMessage={onSend} disabled={isTyping} ref={inputRef} />
    </div>
  );
};

export default ChatContainer;
