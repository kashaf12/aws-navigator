import ChatContainer from "../ChatContainer";
import classes from "./styles.module.css";
import { useChats } from "@/hooks";

const ChatDashboard = () => {
  const { sendMessage, activeChat } = useChats();

  const handleHighlight = (selectors: string[]) => {
    // Implement your highlighting logic here
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Add highlighting effect
      }
    });
  };

  return (
    <>
      <div className={classes.contentArea}>
        <ChatContainer
          chat={activeChat}
          onHighlight={handleHighlight}
          onSend={sendMessage}
        />
      </div>
    </>
  );
};

export default ChatDashboard;
