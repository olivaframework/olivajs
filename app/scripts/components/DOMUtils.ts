class DOMUtils {
  private static instance: DOMUtils = new DOMUtils();

  constructor() {
    if (DOMUtils.instance) {
      throw new Error('Error: Use DOMUtils.functionName instead of new.');
    }
  }

  static removeClassToItems(items, className: string): void {
    let itemsSize = items.length;

    for (let i = 0; i < itemsSize; i++) {
      items[i].classList.remove(className);
    }
  }

  static syncForEach(callback, items: NodeListOf<Element>): void {
    let itemsSize = items.length;

    for (let i = 0; i < itemsSize; i++) {
      callback(items[i]);
    }
  }

  static findParentElementByClass(nodeElement, className) {
    let element = nodeElement;

    while (!element.classList.contains(className) && element) {
      element = element.offsetParent as HTMLElement;
    }

    return element;
  }

  static removeAllChildElements(nodeElement) {
    while (nodeElement.firstChild) {
      nodeElement.removeChild(nodeElement.firstChild);
    }
  }
}

export { DOMUtils };
