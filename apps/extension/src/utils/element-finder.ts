import { Identifier } from "@aws-navigator/schemas";

/**
 * Finds an element using multiple selector strategies
 * @param identifier - The identifier containing various selector options
 * @param context - The context element to search within (defaults to document)
 * @returns The found element or null if not found
 */
export const findElement = (
  identifier: Identifier,
  context: Document = document,
): Element | null => {
  // Try CSS selector
  if (identifier.css_selector) {
    try {
      const element = context.querySelector(identifier.css_selector);
      if (element) return element;
    } catch {
      console.warn(
        "[AWS Navigator] Invalid CSS selector:",
        identifier.css_selector,
      );
    }
  }

  // Try ID selector
  if (identifier.id) {
    const element = context.getElementById(identifier.id);
    if (element) return element;
  }

  // Try XPath
  if (identifier.xpath) {
    try {
      const result = document.evaluate(
        identifier.xpath,
        context,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      if (result.singleNodeValue) return result.singleNodeValue as Element;
    } catch {
      console.warn("[AWS Navigator] Invalid XPath:", identifier.xpath);
    }
  }

  // Try custom attribute
  if (identifier.custom_attribute) {
    try {
      const element = context.querySelector(`[${identifier.custom_attribute}]`);
      if (element) return element;
    } catch {
      console.warn(
        "[AWS Navigator] Invalid custom attribute selector:",
        identifier.custom_attribute,
      );
    }
  }

  // Try text content (using XPath to search by text)
  if (identifier.text_content) {
    try {
      // This XPath finds elements that have the exact text or elements that contain the text
      const xpathQuery = `//*[text()="${identifier.text_content}" or contains(text(), "${identifier.text_content}")]`;
      const result = document.evaluate(
        xpathQuery,
        context,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      if (result.singleNodeValue) return result.singleNodeValue as Element;
    } catch {
      console.warn(
        "[AWS Navigator] Error finding element by text content:",
        identifier.text_content,
      );
    }
  }

  return null;
};

/**
 * Finds all elements matching the identifier
 * @param identifier - The identifier containing various selector options
 * @param context - The context element to search within (defaults to document)
 * @returns Array of found elements
 */
export const findAllElements = (
  identifier: Identifier,
  context: Document = document,
): Element[] => {
  const elements: Element[] = [];

  // Try CSS selector
  if (identifier.css_selector) {
    try {
      elements.push(...context.querySelectorAll(identifier.css_selector));
    } catch {
      console.warn(
        "[AWS Navigator] Invalid CSS selector:",
        identifier.css_selector,
      );
    }
  }

  // Try ID selector (will be only one)
  if (identifier.id) {
    const element = context.getElementById(identifier.id);
    if (element) elements.push(element);
  }

  // Try XPath
  if (identifier.xpath) {
    try {
      const result = document.evaluate(
        identifier.xpath,
        context,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const element = result.snapshotItem(i) as Element;
        if (element) elements.push(element);
      }
    } catch {
      console.warn("[AWS Navigator] Invalid XPath:", identifier.xpath);
    }
  }

  // Try custom attribute
  if (identifier.custom_attribute) {
    try {
      elements.push(
        ...context.querySelectorAll(`[${identifier.custom_attribute}]`),
      );
    } catch {
      console.warn(
        "[AWS Navigator] Invalid custom attribute selector:",
        identifier.custom_attribute,
      );
    }
  }

  // Try text content
  if (identifier.text_content) {
    try {
      const xpathQuery = `//*[text()="${identifier.text_content}" or contains(text(), "${identifier.text_content}")]`;
      const result = document.evaluate(
        xpathQuery,
        context,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const element = result.snapshotItem(i) as Element;
        if (element) elements.push(element);
      }
    } catch {
      console.warn(
        "[AWS Navigator] Error finding elements by text content:",
        identifier.text_content,
      );
    }
  }

  // Remove duplicates
  return [...new Set(elements)];
};
