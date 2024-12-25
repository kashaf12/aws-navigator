import { ConversationContext } from "@/contexts";

const useConversations = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversations must be used within a ConversationProvider"
    );
  }
  return context;
};

export default useConversations;
