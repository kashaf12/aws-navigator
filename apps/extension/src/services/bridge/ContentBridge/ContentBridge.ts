import { onMessage, sendMessage } from "webext-bridge/content-script";
import { ContentScriptContext } from "wxt/client";
import { HighlightService } from "../../highlight";
import { ElementDetector } from "../../element";
import { DOMObserver } from "../../observer";

class ContentBridge {
  private static instance: ContentBridge;
  private ctx: ContentScriptContext;
  private highlightService: HighlightService;
  private elementDetector: ElementDetector;
  private domObserver: DOMObserver;

  private constructor(ctx: ContentScriptContext) {
    this.ctx = ctx;
    this.highlightService = HighlightService.getInstance();
    this.elementDetector = ElementDetector.getInstance();
    this.domObserver = DOMObserver.getInstance();
    this.setupMessageHandlers();
  }

  public static getInstance(ctx: ContentScriptContext): ContentBridge {
    if (!ContentBridge.instance) {
      ContentBridge.instance = new ContentBridge(ctx);
    }
    return ContentBridge.instance;
  }

  private setupMessageHandlers() {
    // Using ctx to ensure listeners are cleaned up when content script is invalidated
    this.ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      this.notifyAWSDetection(newUrl.toString());
    });

    onMessage("highlight:element", async ({ data }) => {
      const { identifier, action, options } = data;

      try {
        if (action === "show") {
          return this.highlightService.highlight(identifier, options);
        } else {
          return this.highlightService.removeHighlight(identifier);
        }
      } catch (error) {
        console.error("[AWS Navigator] Highlight error:", error);
        return false;
      }
    });
  }

  public async notifyAWSDetection(url: string) {
    const isAWS = url.includes("console.aws.amazon.com");
    const consoleType = url.includes("console.aws.amazon.com/console/home")
      ? "global"
      : "regional";

    await sendMessage(
      "aws:detected",
      {
        url,
        isAWS,
        consoleType: isAWS ? consoleType : undefined,
      },
      "background"
    );
  }
}

export default ContentBridge;
