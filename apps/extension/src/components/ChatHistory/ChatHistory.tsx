import { ViewType } from "@/contexts";
import classes from "./styles.module.css";
import { formatDate } from "@/utils/utils";
import { useChats, useView } from "@/hooks";

const ChatHistory = () => {
  const { setActiveView } = useView();
  const { chats, activeChatId, updateActiveChat, deleteChat } = useChats();
  return (
    <div className={classes.container}>
      {chats.length > 0 ? (
        <div className={classes.list}>
          {chats.map((chat) => (
            <div key={chat.id} className={classes.chatWrapper}>
              <button
                onClick={() => {
                  updateActiveChat(chat.id);
                  setActiveView(ViewType.CurrentChat);
                }}
                className={`${classes.chatItem} ${
                  chat.id === activeChatId ? classes.active : ""
                }`}
              >
                <div className={classes.chatInfo}>
                  <span className={classes.chatName}>{chat.name}</span>
                  <span className={classes.timestamp}>
                    {formatDate(chat.updatedAt)}
                  </span>
                </div>
              </button>
              <button
                onClick={() => deleteChat(chat.id)}
                className={classes.deleteButton}
                aria-label="Delete chat"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyState}>
          <i>No chats yet. Please create a chat to get started.</i>
          <button
            onClick={() => setActiveView(ViewType.CurrentChat)}
            className={classes.newChatButton}
          >
            Start New Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
