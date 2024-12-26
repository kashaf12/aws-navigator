import { BackendResponse } from "@/types";
import { ChatService } from "../types";

class ApiChat implements ChatService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async sendMessage(content: string): Promise<BackendResponse> {
    const response = await fetch(`${this.apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  }
}

export default ApiChat;
