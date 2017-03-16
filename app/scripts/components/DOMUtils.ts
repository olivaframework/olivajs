class DOMUtils {
  private static instance: DOMUtils = new DOMUtils();

  constructor() {
    if (DOMUtils.instance) {
      throw new Error('Error: Use DOMUtils.functionName instead of new.');
    }
  }

  static removeClassToItems(
    elements: NodeListOf<Element>,
    className: string
  ): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      this.removeClass(elements[i], className);
    }
  }

  static syncForEach(
    callback: (elements: HTMLElement) => void,
    elements: NodeListOf<Element>
  ): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      callback(elements[i] as HTMLElement);
    }
  }

  static findParentElementByClass(
    nodeElement: HTMLElement,
    className: string
  ): HTMLElement {
    let element = nodeElement;

    while (!this.containsClass(element, className) && element) {
      element = element.parentNode as HTMLElement;
    }

    return element;
  }

  static removeElements(elements: NodeListOf<Element>): void {
    let elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  static getIndexNode(nodeElement: Element): number {
    let parent = nodeElement.parentNode as HTMLElement;
    let children = parent.children;
    let childrenSize = children.length;

    for (let i = 0; i < childrenSize; i++) {
      if (nodeElement === children[i]) {
        return i + 1;
      }
    }
  }

  static addClass(nodeElement: Element, className: string): void {
    let classes = nodeElement.className;

    if (classes.indexOf(className) === -1) {
      if (classes === '') {
        nodeElement.className = className;
      } else {
        nodeElement.className = classes.concat(' ' + className);
      }
    }
  }

  static removeClass(nodeElement: Element, className: string): void {
    let regex = new RegExp('(^|\\s+)' + className);

    nodeElement.className = nodeElement.className.replace(regex, '');
  }

  static toggleClass(nodeElement: Element, className: string): void {
    if (this.containsClass(nodeElement, className)) {
      this.removeClass(nodeElement, className);
    } else {
      this.addClass(nodeElement, className);
    }
  }

  static containsClass(nodeElement: Element, className: string): boolean {
    let regex = new RegExp('(^|\\s+)' + className + '(\\s+|$)');

    return regex.test(nodeElement.className);
  }
}

export { DOMUtils };
