import { BackendResponse } from "@/types/chat";
import { Task } from "@aws-navigator/schemas";

const EXAMPLE_TASKS: Record<string, Task> = {
  s3_bucket: {
    task: "Create an S3 Bucket",
    steps: [
      {
        step_number: 1,
        description: "Navigate to S3 Console",
        ui_elements: [
          {
            type: "button",
            identifier: {
              css_selector: "#nav-service-button-s3",
            },
            action: "click",
          },
        ],
        preconditions: {
          current_url_contains: "console.aws.amazon.com",
        },
      },
      {
        step_number: 2,
        description: "Click Create Bucket",
        ui_elements: [
          {
            type: "button",
            identifier: {
              css_selector: "#create-bucket-button",
            },
            action: "click",
          },
        ],
        preconditions: {
          current_url_contains: "s3.console.aws.amazon.com",
        },
      },
    ],
  },
  // Add more task examples as needed
};

export const mockBackendResponse = async (
  content: string
): Promise<BackendResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Example response logic based on user input
  if (
    content.toLowerCase().includes("create s3") ||
    content.toLowerCase().includes("s3 bucket")
  ) {
    return {
      content: `Here's how to create an S3 bucket. I'll guide you through the process.
        
Source: AWS Documentation - [Creating a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)`,
      tasks: [EXAMPLE_TASKS.s3_bucket],
    };
  }

  // Default response when no specific task is matched
  return {
    content: `I understand you're asking about: ${content}
      
Let me help guide you through this. Could you please provide more specific details about what you'd like to achieve in AWS?

For example:
- Are you trying to create a specific resource?
- Are you looking to configure an existing service?
- Do you need help with a specific AWS feature?`,
    tasks: [], // No specific tasks for generic responses
  };
};
