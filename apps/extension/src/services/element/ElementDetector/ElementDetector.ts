import { Identifier } from "@aws-navigator/schemas";

class ElementDetector {
  private static instance: ElementDetector;

  private constructor() {}

  public static getInstance(): ElementDetector {
    if (!ElementDetector.instance) {
      ElementDetector.instance = new ElementDetector();
    }
    return ElementDetector.instance;
  }

  /**
   * Finds an element using multiple selector strategies
   */
  public findElement(
    identifier: Identifier,
    context: Document | Element = document
  ): Element | null {
    const strategies = [
      this.findByCssSelector,
      this.findById,
      this.findByXPath,
      this.findByCustomAttribute,
      this.findByTextContent,
    ];

    for (const strategy of strategies) {
      const element = strategy.call(this, identifier, context);
      if (element) return element;
    }

    return null;
  }

  /**
   * Finds all elements matching the identifier
   */
  public findAllElements(
    identifier: Identifier,
    context: Document | Element = document
  ): Element[] {
    const elements: Set<Element> = new Set();

    const strategies = [
      this.findAllByCssSelector,
      this.findAllById,
      this.findAllByXPath,
      this.findAllByCustomAttribute,
      this.findAllByTextContent,
    ];

    for (const strategy of strategies) {
      const found = strategy.call(this, identifier, context);
      found.forEach((element) => elements.add(element));
    }

    return Array.from(elements);
  }

  private findByCssSelector(
    identifier: Identifier,
    context: Document | Element
  ): Element | null {
    if (!identifier.css_selector) return null;
    try {
      return context.querySelector(identifier.css_selector);
    } catch (error) {
      console.warn(
        "[AWS Navigator] Invalid CSS selector:",
        identifier.css_selector,
        error
      );
      return null;
    }
  }

  private findById(
    identifier: Identifier,
    context: Document | Element
  ): Element | null {
    if (!identifier.id) return null;
    return context instanceof Document
      ? context.getElementById(identifier.id)
      : context.querySelector(`#${identifier.id}`);
  }

  private findByXPath(
    identifier: Identifier,
    context: Document | Element
  ): Element | null {
    if (!identifier.xpath) return null;
    try {
      const result = document.evaluate(
        identifier.xpath,
        context,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue as Element;
    } catch (error) {
      console.warn("[AWS Navigator] Invalid XPath:", identifier.xpath, error);
      return null;
    }
  }

  private findByCustomAttribute(
    identifier: Identifier,
    context: Document | Element
  ): Element | null {
    if (!identifier.custom_attribute) return null;
    try {
      return context.querySelector(`[${identifier.custom_attribute}]`);
    } catch (error) {
      console.warn(
        "[AWS Navigator] Invalid custom attribute:",
        identifier.custom_attribute,
        error
      );
      return null;
    }
  }

  private findByTextContent(
    identifier: Identifier,
    context: Document | Element
  ): Element | null {
    if (!identifier.text_content) return null;
    try {
      const xpathQuery = `//*[text()="${identifier.text_content}" or contains(text(), "${identifier.text_content}")]`;
      const result = document.evaluate(
        xpathQuery,
        context,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue as Element;
    } catch (error) {
      console.warn(
        "[AWS Navigator] Error finding element by text:",
        identifier.text_content,
        error
      );
      return null;
    }
  }

  private findAllByCssSelector(
    identifier: Identifier,
    context: Document | Element
  ): Element[] {
    if (!identifier.css_selector) return [];
    try {
      return Array.from(context.querySelectorAll(identifier.css_selector));
    } catch (error) {
      console.warn(
        "[AWS Navigator] Invalid CSS selector:",
        identifier.css_selector,
        error
      );
      return [];
    }
  }

  private findAllById(
    identifier: Identifier,
    context: Document | Element
  ): Element[] {
    if (!identifier.id) return [];
    const element =
      context instanceof Document
        ? context.getElementById(identifier.id)
        : context.querySelector(`#${identifier.id}`);
    return element ? [element] : [];
  }

  private findAllByXPath(
    identifier: Identifier,
    context: Document | Element
  ): Element[] {
    if (!identifier.xpath) return [];
    try {
      const elements: Element[] = [];
      const result = document.evaluate(
        identifier.xpath,
        context,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const element = result.snapshotItem(i) as Element;
        if (element) elements.push(element);
      }
      return elements;
    } catch (error) {
      console.warn("[AWS Navigator] Invalid XPath:", identifier.xpath, error);
      return [];
    }
  }

  private findAllByCustomAttribute(
    identifier: Identifier,
    context: Document | Element
  ): Element[] {
    if (!identifier.custom_attribute) return [];
    try {
      return Array.from(
        context.querySelectorAll(`[${identifier.custom_attribute}]`)
      );
    } catch (error) {
      console.warn(
        "[AWS Navigator] Invalid custom attribute:",
        identifier.custom_attribute,
        error
      );
      return [];
    }
  }

  private findAllByTextContent(
    identifier: Identifier,
    context: Document | Element
  ): Element[] {
    if (!identifier.text_content) return [];
    try {
      const elements: Element[] = [];
      const xpathQuery = `//*[text()="${identifier.text_content}" or contains(text(), "${identifier.text_content}")]`;
      const result = document.evaluate(
        xpathQuery,
        context,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const element = result.snapshotItem(i) as Element;
        if (element) elements.push(element);
      }
      return elements;
    } catch (error) {
      console.warn(
        "[AWS Navigator] Error finding elements by text:",
        identifier.text_content,
        error
      );
      return [];
    }
  }
}

export default ElementDetector;
