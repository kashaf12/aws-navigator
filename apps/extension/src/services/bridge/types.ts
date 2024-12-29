import { ProtocolWithReturn } from "webext-bridge";
import { TabState } from "@/contexts";
import { Identifier } from "@aws-navigator/schemas";
import { HighlightOptions } from "../highlight";

declare module "webext-bridge" {
  export interface ProtocolMap {
    // Task related
    "task:update": ProtocolWithReturn<
      {
        taskId: string;
        status: string;
        stepIndex?: number;
        flowId?: number;
      },
      void
    >;
    "task:start": ProtocolWithReturn<{ taskId: string }, void>;
    "tab:state": ProtocolWithReturn<Partial<TabState>, void>;
    "tab:query": ProtocolWithReturn<void, TabState>;

    // Highlight related
    "highlight:element": ProtocolWithReturn<
      {
        identifier: Identifier;
        action: "show" | "hide";
        options?: HighlightOptions;
      },
      boolean
    >;
    "highlight:status": {
      status: "completed" | "failed";
      error?: string;
    };

    // AWS Detection
    "aws:detected": {
      url: string;
      isAWS: boolean;
      consoleType?: "global" | "regional";
    };
  }
}
