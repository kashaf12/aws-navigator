export interface ElementCallback {
  (element: Element): void;
}

export interface DOMObserverOptions {
  subtree?: boolean;
  childList?: boolean;
  attributes?: boolean;
  characterData?: boolean;
  throttleTime?: number;
}

export interface ObserverSubscription {
  unsubscribe: () => void;
}
