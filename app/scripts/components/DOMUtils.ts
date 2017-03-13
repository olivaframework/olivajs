class DOMUtils {
  private static instance: DOMUtils = new DOMUtils();

  constructor() {
    if (DOMUtils.instance) {
      throw new Error('Error: Use DOMUtils.functionName instead of new.');
    }
  }

  static removeClassToItems(elements, className: string): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      elements[i].classList.remove(className);
    }
  }

  static syncForEach(callback, elements: NodeListOf<Element>): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      callback(elements[i]);
    }
  }

  static findParentElementByClass(nodeElement, className): HTMLElement {
    let element = nodeElement;

    while (!element.classList.contains(className) && element) {
      element = element.parentNode as HTMLElement;
    }

    return element;
  }

  static removeAllChildElements(nodeElement): void {
    while (nodeElement.firstChild) {
      nodeElement.removeChild(nodeElement.firstChild);
    }
  }

  static removeElements(elements: NodeListOf<Element>): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  static getBodyHeight(): number {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
  }

  static getIndexNode(nodeElement): number {
    let children = nodeElement.parentNode.children;
    let childrenSize = children.length;

    for (let i = 0; i < childrenSize; i++) {
      if (nodeElement === children[i]) {
        return i + 1;
      }
    }
  }
}
export { DOMUtils };
