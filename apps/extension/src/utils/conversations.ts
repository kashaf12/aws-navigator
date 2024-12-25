import { Conversation } from "@/types/chat";

export const sortConversations = (convs: Conversation[]): Conversation[] => {
  return convs.sort((a, b) => {
    const updatedAtComparison =
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (updatedAtComparison !== 0) {
      return updatedAtComparison; // Sort by updatedAt first
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then by createdAt
  });
};
