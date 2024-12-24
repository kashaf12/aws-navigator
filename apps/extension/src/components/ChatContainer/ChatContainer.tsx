import { useState, useRef, useEffect } from "react";
import { Message, Step, BackendResponse } from "../../types/chat";
import ChatMessage from "../ChatMessage";
import TypingIndicator from "../TypingIndicator";
import classes from "./styles.module.css";
import { ChatContainerProps } from "./types";
import ChatInput from "../ChatInput";

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

  const handleHighlight = (steps: Step[]) => {
    const selectors = steps
      .filter((step) => step.selector)
      .map((step) => step.selector as string);

    if (selectors.length > 0 && onHighlight) {
      onHighlight(selectors);
    }
  };

  const mockBackendResponse = async (
    content: string,
  ): Promise<BackendResponse> => {
    // Example mock response - replace with actual API call
    if (content.toLowerCase().includes("create s3 bucket")) {
      return {
        type: "steps",
        message: "Here's how to create an S3 bucket:",
        steps: [
          {
            id: "1",
            description: "Open the S3 Console",
            selector: "#s3-console-btn",
          },
          {
            id: "2",
            description: 'Click "Create bucket"',
            selector: "#create-bucket-btn",
          },
          // ... more steps
        ],
      };
    }

    return {
      type: "conversation",
      message: `I'll help you with that: ${content}`,
    };
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
        content: response.message,
        timestamp: new Date(),
        steps: response.type === "steps" ? response.steps : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
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
            onHighlight={handleHighlight}
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
