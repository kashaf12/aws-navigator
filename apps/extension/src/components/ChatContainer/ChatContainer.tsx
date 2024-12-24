import { useState, useRef, useEffect } from "react";
import { Message } from "../../types/chat";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import { ChatContainerProps } from "./types";
import ChatInput from "../ChatInput";
import { Task } from "@aws-navigator/schemas";
import { mockBackendResponse } from "./mock";

const ChatContainer = ({
  initialMessage = "Hello! I'm your AWS Navigator assistant. How can I help you today?",
  className = "",
  onHighlight,
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleHighlight = (task: Task) => {
    // Extract all unique CSS selectors from the task's steps and UI elements
    const selectors = task.steps.flatMap((step) =>
      step.ui_elements.map((element) => element.identifier.css_selector)
    );

    const uniqueSelectors = [...new Set(selectors)];

    if (uniqueSelectors.length > 0 && onHighlight) {
      onHighlight(uniqueSelectors);
    }

    // Optionally: Check preconditions before highlighting
    task.steps.forEach((step) => {
      if (step.preconditions) {
        const { current_url_contains, ui_element_exists } = step.preconditions;

        // Check URL condition
        if (
          current_url_contains &&
          !window.location.href.includes(current_url_contains)
        ) {
          console.warn(
            `Warning: Current URL does not match required path: ${current_url_contains}`
          );
        }

        // Check UI element existence
        if (ui_element_exists?.css_selector) {
          const elementExists = document.querySelector(
            ui_element_exists.css_selector
          );
          if (!elementExists) {
            console.warn(
              `Warning: Required UI element not found: ${ui_element_exists.css_selector}`
            );
          }
        }
      }
    });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await mockBackendResponse(content);

      const assistantMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        tasks: response.tasks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Handle error case
      console.error("Error getting response:", error);

      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`${classes.chatContainer} ${className}`}>
      <div className={classes.messagesContainer}>
        {messages.map((message) => (
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
