import { BackendResponse } from "@/types";
import { ChatService } from "../types";
import { Task } from "@aws-navigator/schemas";
import createS3Bucket from "./tasks/createS3Task.json";
import deployServerlessWebapp from "./tasks/deployServerlessWebapp.json";

const EXAMPLE_TASKS: Record<string, Task> = {
  s3_bucket: createS3Bucket as Task,
  serverless: deployServerlessWebapp as Task,
};

class MockChat implements ChatService {
  async sendMessage(content: string): Promise<BackendResponse> {
    // Current mock logic from mockBackendResponse
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example response logic based on user input
    if (
      content.toLowerCase().includes("create s3") ||
      content.toLowerCase().includes("s3 bucket")
    ) {
      return {
        success: true,
        content: `Here's how to create an S3 bucket. I'll guide you through the process.
        
Source: AWS Documentation - [Creating a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)`,
        tasks: [EXAMPLE_TASKS.s3_bucket],
      };
    }

    if (
      content.toLowerCase().includes("create serverless") ||
      content.toLowerCase().includes("serverless")
    ) {
      return {
        success: true,
        content: `Here's how to create an serverless webapp. I'll guide you through the process.
        
Source: AWS Documentation - [serverless](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)`,
        tasks: [EXAMPLE_TASKS.serverless],
      };
    }

    if (content.toLowerCase().includes("error not api")) {
      return {
        success: false,
        error: {
          code: "NOT_API_ERROR",
          message: "This is a custom error message",
        },
      };
    }

    if (content.toLowerCase().includes("error")) {
      throw new Error("Failed to get response. Please try again.");
    }

    // Default response when no specific task is matched
    return {
      success: true,
      content: `I understand you're asking about: ${content}
      
Let me help guide you through this. Could you please provide more specific details about what you'd like to achieve in AWS?

For example:
- Are you trying to create a specific resource?
- Are you looking to configure an existing service?
- Do you need help with a specific AWS feature?`,
      tasks: [], // No specific tasks for generic responses
    };
  }
}

export default MockChat;
