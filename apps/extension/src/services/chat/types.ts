import { BackendResponse } from "@/types";

export interface ChatService {
  sendMessage(content: string): Promise<BackendResponse>;
}
