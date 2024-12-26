import { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import ChatInput from "../ChatInput";
import ChatEmptyState from "../ChatEmptyState";
import { useAutoScroll, useTask, useView } from "@/hooks";
import { ChatStatus } from "@/types";
import { ViewType } from "@/contexts";

const ChatContainer = () => {
  const { sendMessage, activeChat } = useChats();
  const { startTask } = useTask();
  const { setActiveView } = useView();
  const messagesEndRef = useAutoScroll([activeChat?.updatedAt]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChat]);

  return (
    <div className={classes.chatContainer}>
      {activeChat ? (
        <div className={classes.messagesContainer}>
          {activeChat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onStartTask={(task) => {
                startTask(task, {
                  chatId: activeChat.id,
                  messageId: message.id,
                });
                setActiveView(ViewType.Task);
              }}
            />
          ))}
          {activeChat?.status === ChatStatus.PENDING && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <ChatEmptyState />
      )}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={activeChat?.status === ChatStatus.PENDING}
        ref={inputRef}
      />
    </div>
  );
};

export default ChatContainer;
