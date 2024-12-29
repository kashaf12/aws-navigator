import { ElementDetector } from "../../element";
import { DOMObserver } from "../../observer";
import { Identifier } from "@aws-navigator/schemas";
import { HighlightOptions, HighlightStyles } from "./types";

class HighlightService {
  private static instance: HighlightService;
  private highlightedElements: Map<string, Element> = new Map();
  private elementDetector: ElementDetector;
  private domObserver: DOMObserver;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  private defaultStyles: HighlightStyles = {
    outline: "2px solid #2563eb",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    transition: "all 0.2s ease-in-out",
  };

  private constructor() {
    this.elementDetector = ElementDetector.getInstance();
    this.domObserver = DOMObserver.getInstance();
  }

  public static getInstance(): HighlightService {
    if (!HighlightService.instance) {
      HighlightService.instance = new HighlightService();
    }
    return HighlightService.instance;
  }

  public highlight(
    identifier: Identifier,
    options: HighlightOptions = {}
  ): boolean {
    const key = JSON.stringify(identifier);

    // Check if already highlighted
    if (this.highlightedElements.has(key)) {
      return true;
    }

    const element = this.elementDetector.findElement(identifier);
    if (element) {
      this.applyHighlight(element, options);
      this.highlightedElements.set(key, element);

      // Set up observer for element
      const subscription = this.domObserver.observeElement(
        identifier,
        (newElement) => {
          this.applyHighlight(newElement, options);
          this.highlightedElements.set(key, newElement);
        }
      );

      this.subscriptions.set(key, subscription);
      return true;
    }

    return false;
  }

  public removeHighlight(identifier: Identifier): boolean {
    const key = JSON.stringify(identifier);
    const element = this.highlightedElements.get(key);

    if (element) {
      this.removeStyles(element);
      this.highlightedElements.delete(key);

      // Clean up observer
      const subscription = this.subscriptions.get(key);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
      }

      return true;
    }

    return false;
  }

  public removeAllHighlights(): void {
    this.highlightedElements.forEach((element) => {
      this.removeStyles(element);
    });
    this.highlightedElements.clear();

    // Clean up all observers
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();
  }

  private applyHighlight(element: Element, options: HighlightOptions): void {
    const styles = {
      ...this.defaultStyles,
      ...options.styles,
    };

    if (element instanceof HTMLElement) {
      Object.assign(element.style, styles);

      if (options.scrollIntoView) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  private removeStyles(element: Element): void {
    if (element instanceof HTMLElement) {
      element.style.outline = "";
      element.style.backgroundColor = "";
      element.style.transition = "";
    }
  }
}

export default HighlightService;
