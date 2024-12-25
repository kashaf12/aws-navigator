import { Conversation, Message } from "@/types/chat";
import ChatContainer from "../ChatContainer";
import ConversationList from "../ConversationList";
import classes from "./styles.module.css";
import { useConversations } from "@/hooks";
import { generateConversationName } from "@/utils/utils";
import { mockBackendResponse } from "./mock";

const ChatDashboard = () => {
  const {
    conversations,
    addOrUpdateConversation,
    deleteConversation,
    activeConversationId,
    updateActiveConversation,
  } = useConversations();
  const [isTyping, setIsTyping] = useState(false);

  const handleOnNewChat = async () => {
    await updateActiveConversation(null);
  };

  const handleOnAddUpdateChat = async (conversation: Conversation) => {
    await addOrUpdateConversation(conversation);
    await updateActiveConversation(conversation.id);
  };

  const handleHighlight = (selectors: string[]) => {
    // Implement your highlighting logic here
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Add highlighting effect
      }
    });
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return; // Prevent sending empty messages

    const currentConversation = activeConversation || {
      id: crypto.randomUUID(),
      name: generateConversationName(content),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    const userMessage: Message = {
      id: currentConversation?.messages?.length + 1,
      type: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [
      ...(currentConversation?.messages || []),
      userMessage,
    ];

    handleOnAddUpdateChat({
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: new Date(),
    });

    setIsTyping(true);

    try {
      const response = await mockBackendResponse(content);

      const assistantMessage: Message = {
        id: currentConversation.messages.length + 2,
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        tasks: response.tasks,
      };

      handleOnAddUpdateChat({
        ...currentConversation,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error getting response:", error);

      const errorMessage: Message = {
        id: currentConversation.messages.length + 2,
        type: "assistant",
        content:
          "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      handleOnAddUpdateChat({
        ...currentConversation,
        messages: [...updatedMessages, errorMessage],
        updatedAt: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={updateActiveConversation}
        onNewChat={handleOnNewChat}
        onDelete={deleteConversation}
      />
      <div className={classes.contentArea}>
        <ChatContainer
          conversation={activeConversation}
          onHighlight={handleHighlight}
          onSend={handleSendMessage}
          isTyping={isTyping}
        />
      </div>
    </>
  );
};

export default ChatDashboard;
