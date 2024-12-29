import {
  DOMObserverOptions,
  ElementCallback,
  ObserverSubscription,
} from "./types";
import { Identifier } from "@aws-navigator/schemas";
import { ElementDetector } from "../../element";

class DOMObserver {
  private static instance: DOMObserver;
  private observer: MutationObserver | null = null;
  private elementDetector: ElementDetector;
  private activeObservations: Map<string, Set<ElementCallback>> = new Map();
  private throttleTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.elementDetector = ElementDetector.getInstance();
  }

  public static getInstance(): DOMObserver {
    if (!DOMObserver.instance) {
      DOMObserver.instance = new DOMObserver();
    }
    return DOMObserver.instance;
  }

  /**
   * Start observing DOM for a specific element using identifier
   */
  public observeElement(
    identifier: Identifier,
    callback: ElementCallback,
    options: DOMObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: false,
      throttleTime: 100,
    }
  ): ObserverSubscription {
    const key = this.getIdentifierKey(identifier);

    // Initialize callbacks set for this identifier if it doesn't exist
    if (!this.activeObservations.has(key)) {
      this.activeObservations.set(key, new Set());
    }

    // Add the callback
    this.activeObservations.get(key)!.add(callback);

    // Start observing if this is the first subscription
    if (!this.observer) {
      this.startObserving(options);
    }

    // Check if element already exists
    const existingElement = this.elementDetector.findElement(identifier);
    if (existingElement) {
      callback(existingElement);
    }

    // Return unsubscribe function
    return {
      unsubscribe: () => {
        const callbacks = this.activeObservations.get(key);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.activeObservations.delete(key);
          }
        }

        // Stop observing if no more subscriptions
        if (this.activeObservations.size === 0) {
          this.stopObserving();
        }
      },
    };
  }

  private startObserving(options: DOMObserverOptions): void {
    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations, options.throttleTime);
    });

    this.observer.observe(document.body, {
      subtree: options.subtree ?? true,
      childList: options.childList ?? true,
      attributes: options.attributes ?? true,
      characterData: options.characterData ?? false,
    });
  }

  private stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private handleMutations(
    mutations: MutationRecord[],
    throttleTime = 100
  ): void {
    // Process each active observation
    for (const [key, callbacks] of this.activeObservations) {
      // Clear existing timer for this identifier
      if (this.throttleTimers.has(key)) {
        clearTimeout(this.throttleTimers.get(key));
      }

      // Set new timer
      this.throttleTimers.set(
        key,
        setTimeout(() => {
          const identifier = this.parseIdentifierKey(key);
          const element = this.elementDetector.findElement(identifier);

          if (element) {
            callbacks.forEach((callback) => callback(element));
          }
        }, throttleTime)
      );
    }
  }

  private getIdentifierKey(identifier: Identifier): string {
    return JSON.stringify(identifier);
  }

  private parseIdentifierKey(key: string): Identifier {
    return JSON.parse(key);
  }
}

export default DOMObserver;
