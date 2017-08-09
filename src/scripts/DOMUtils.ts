interface Offset {
  left: number;
  top: number;
}

class DOMUtils {
  private static instance: DOMUtils = new DOMUtils();

  constructor() {
    if (DOMUtils.instance) {
      throw new Error('Error: Use DOMUtils.functionName instead of new.');
    }
  }

  static dispatchCustomEvent(element: Element, eventName: string) {
    const event = new CustomEvent(eventName);

    element.dispatchEvent(event);
  }

  static removeClassToItems(
    elements: NodeListOf<Element>,
    className: string
  ): void {
    const elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      this.removeClass(elements[i], className);
    }
  }

  static syncForEach(
    callback: (elements: HTMLElement) => void,
    elements: NodeListOf<Element>
  ): void {
    const elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      callback(elements[i] as HTMLElement);
    }
  }

  static findParentElementByClass(
    nodeElement: HTMLElement,
    className: string
  ): HTMLElement {
    let element = nodeElement;

    while (element) {
      if (this.containsClass(element, className)) {
        return element;
      }

      element = element.parentNode as HTMLElement;
    }

    return null;
  }

  static removeElements(elements: NodeListOf<Element>): void {
    const elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  static removeAllChildren(nodeElement: Element): void {
    while (nodeElement.firstChild) {
      nodeElement.removeChild(nodeElement.firstChild);
    }
  }

  static getIndexNode(nodeElement: Element): number {
    const parent = nodeElement.parentNode as HTMLElement;
    const children = parent.children;
    const childrenSize = children.length;

    for (let i = 0; i < childrenSize; i++) {
      if (nodeElement === children[i]) {
        return i + 1;
      }
    }
  }

  static addClass(nodeElement: Element, className: string): void {
    const classes = nodeElement.className;

    if (classes.indexOf(className) === -1) {
      if (classes === '') {
        nodeElement.className = className;
      } else {
        nodeElement.className = classes.concat(' ' + className);
      }
    }
  }

  static addClasses(nodeElement: Element, classes: string[]): void {
    for (const className of classes) {
      this.addClass(nodeElement, className);
    }
  }

  static addClassToItems(
    elements: NodeListOf<Element>,
    className: string
  ): void {
    const elementsSize = elements.length;

    for (let i = 0; i < elementsSize; i++) {
      this.addClass(elements[i], className);
    }
  }

  static removeClass(nodeElement: Element, className: string): void {
    const regex = new RegExp('(^|\\s+)' + className);

    nodeElement.className = nodeElement.className.replace(regex, '');
  }

  static removeClasses(nodeElement: Element, classes: string[]): void {
    for (const className of classes) {
      this.removeClass(nodeElement, className);
    }
  }

  static toggleClass(nodeElement: Element, className: string): void {
    if (this.containsClass(nodeElement, className)) {
      this.removeClass(nodeElement, className);
    } else {
      this.addClass(nodeElement, className);
    }
  }

  static containsClass(nodeElement: Element, className: string): boolean {
    const regex = new RegExp('(^|\\s+)' + className + '(\\s+|$)');

    return regex.test(nodeElement.className);
  }

  static getOffset(element: HTMLElement): Offset {
    let offsetLeft = 0;
    let offsetTop = 0;
    let currentElement = element;

    while (currentElement.offsetParent) {
      offsetLeft += currentElement.offsetLeft;
      offsetTop += currentElement.offsetTop;

      currentElement = currentElement.offsetParent as HTMLElement;
    }

    return {
      left: offsetLeft,
      top: offsetTop
    };
  }

  static itemsPerRowSection(
    container: HTMLElement,
    className: string
  ): number[] {
    let distance = 0;
    let itemsCount = 1;
    const itemsPerSection = [];
    const elements = container.querySelectorAll(`.${ className }`);
    const itemsSize = elements.length;

    for (let i = 0; i < itemsSize; i++) {
      const item = elements[i] as HTMLElement;

      distance = distance + item.offsetWidth;

      if (distance > container.offsetWidth) {
        if (distance < container.offsetWidth + itemsSize) {
          itemsPerSection.push(itemsCount);
          distance = 0;
          itemsCount = 0;
        } else {
          itemsPerSection.push(itemsCount - 1);
          distance = item.offsetWidth;
          itemsCount = 1;
        }
      }

      if (i === itemsSize - 1 && itemsCount > 0) {
        itemsPerSection.push(itemsCount);
      }

      itemsCount++;
    }

    return itemsPerSection;
  }
}

export { DOMUtils };
