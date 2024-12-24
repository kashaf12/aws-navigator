import { useState, useRef, useEffect } from "react";
import { Message } from "../../types/chat";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import { ChatContainerProps } from "./types";
import ChatInput from "../ChatInput";
import { mockBackendResponse } from "./mock";
import { Task } from "@aws-navigator/schemas";

const ChatContainer = ({
  conversation,
  className = "",
  onHighlight,
  onUpdate,
}: ChatContainerProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleHighlight = (task: Task) => {
    // Extract all unique CSS selectors from the task's steps and UI elements
    const selectors = task.steps.flatMap((step) =>
      step.ui_elements.map((element) => element.identifier.css_selector)
    );

    const uniqueSelectors = [...new Set(selectors)];

    if (uniqueSelectors.length > 0 && onHighlight) {
      onHighlight(uniqueSelectors);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: conversation.messages.length + 1,
      type: "user",
      content,
      timestamp: new Date(),
    };

    // Update conversation with user message
    const updatedMessages = [...conversation.messages, userMessage];
    onUpdate({
      ...conversation,
      messages: updatedMessages,
      updatedAt: new Date(),
    });

    setIsTyping(true);

    try {
      const response = await mockBackendResponse(content);

      const assistantMessage: Message = {
        id: conversation.messages.length + 2,
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        tasks: response.tasks,
      };

      // Update conversation with assistant response
      onUpdate({
        ...conversation,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error getting response:", error);

      const errorMessage: Message = {
        id: conversation.messages.length + 2,
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      onUpdate({
        ...conversation,
        messages: [...updatedMessages, errorMessage],
        updatedAt: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`${classes.chatContainer} ${className}`}>
      <div className={classes.messagesContainer}>
        {conversation.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onStartTask={handleHighlight}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
