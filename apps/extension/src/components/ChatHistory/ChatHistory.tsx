import { ViewType } from "@/contexts";
import classes from "./styles.module.css";
import { formatDate } from "@/utils";
import { useChats, useView } from "@/hooks";
import { ChatStatus } from "@/types";
import EmptyContainer from "../EmptyContainer";
import { History } from "lucide-react";

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
                  <div className={classes.chatNameRow}>
                    <span className={classes.chatName}>{chat.name}</span>
                    {chat.status === ChatStatus.PENDING && (
                      <span className={classes.pendingIndicator} />
                    )}
                  </div>
                  <span className={classes.timestamp}>
                    {formatDate(chat.updatedAt)}
                  </span>
                </div>
              </button>
              {chat.status !== ChatStatus.PENDING && (
                <button
                  onClick={() => deleteChat(chat.id)}
                  className={classes.deleteButton}
                  aria-label="Delete chat"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyContainer
          Icon={History}
          title="No Chats Yet."
          description="Please create a chat to get started."
          buttonText="Start New Chat"
          onClick={() => setActiveView(ViewType.CurrentChat)}
        />
      )}
    </div>
  );
};

export default ChatHistory;
