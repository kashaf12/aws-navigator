import { Chat } from "@/types";

export const sortChats = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => {
    const updatedAtComparison =
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (updatedAtComparison !== 0) {
      return updatedAtComparison; // Sort by updatedAt first
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then by createdAt
  });
};

export const generateChatName = (firstMessage: string): string => {
  const name = firstMessage.slice(0, 30);
  return name.length < firstMessage.length ? `${name}...` : name;
};
