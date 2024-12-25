import { useState, FormEvent, forwardRef, ForwardedRef } from "react";
import { ChatInputProps } from "./types";
import classes from "./styles.module.css";

const ChatInput = (
  { onSendMessage, disabled }: ChatInputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className={classes.inputContainer}>
      <form className={classes.inputForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your AWS question here..."
          disabled={disabled}
          className={classes.messageInput}
          ref={ref}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={classes.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default forwardRef(ChatInput);
