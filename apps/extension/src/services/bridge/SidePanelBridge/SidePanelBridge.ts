import { HighlightOptions } from "@/services/highlight";
import { Identifier } from "@aws-navigator/schemas";
import { sendMessage } from "webext-bridge/popup";

class SidePanelBridge {
  private static instance: SidePanelBridge;

  private constructor() {}

  public static getInstance(): SidePanelBridge {
    if (!SidePanelBridge.instance) {
      SidePanelBridge.instance = new SidePanelBridge();
    }
    return SidePanelBridge.instance;
  }

  public async highlightElement(
    tabId: number,
    identifier: Identifier,
    action: "show" | "hide",
    options?: HighlightOptions
  ): Promise<boolean> {
    try {
      return await sendMessage(
        "highlight:element",
        { identifier, action, options },
        `content-script@${tabId}`
      );
    } catch (error) {
      console.error("[AWS Navigator] Failed to send highlight command:", error);
      return false;
    }
  }

  public async startTask(taskId: string): Promise<void> {
    await sendMessage("task:start", { taskId }, "background");
  }

  public async updateTask(
    taskId: string,
    status: string,
    stepIndex?: number,
    flowId?: number
  ): Promise<void> {
    await sendMessage(
      "task:update",
      {
        taskId,
        status,
        stepIndex,
        flowId,
      },
      "background"
    );
  }
}

export default SidePanelBridge;
