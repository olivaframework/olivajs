import { DOMUtils } from './DOMUtils';

interface Events {
  callback: (event?: any) => void;
  name: string;
}

interface Attributes {
  name: string;
  value: string;
}

class DOMElement {
  private element: HTMLElement;

  constructor(tag: string) {
    this.element = document.createElement(tag);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setId(id: string): void {
    this.element.id = id;
  }

  public setContent(content: string): void {
    this.element.innerHTML = content;
  }

  public setAttributes(atributes: Attributes[]): void {
    for (const item of atributes) {
      this.element.setAttribute(item.name, item.value);
    }
  }

  public removeAllChildren(): void {
    DOMUtils.removeAllChildren(this.element);
  }

  public addClasses(classes: string[]): void {
    for (const item of classes) {
      DOMUtils.addClass(this.element, item);
    }
  }

  public removeClasses(classes: string[]): void {
    for (const item of classes) {
      DOMUtils.removeClass(this.element, item);
    }
  }

  public toggleClasses(classes: string[]): void {
    for (const item of classes) {
      DOMUtils.toggleClass(this.element, item);
    }
  }

  public setStyles(styles: Object): void {
    for (const property in styles) {
      this.element.style[property] = styles[property];
    }
  }

  public destroy(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public render(node: Node): void {
    node.appendChild(this.element);
  }

  public renderBefore(node, index: number) {
    const childrenNodes = node.children;

    node.insertBefore(this.element, childrenNodes[index]);
  }

  public addEvents(events: Events[]): void {
    for (const item of events) {
      this.element.addEventListener(item.name, item.callback);
    }
  }

  public removeEvents(events: Events[]): void {
    for (const item of events) {
      this.element.removeEventListener(item.name, item.callback);
    }
  }
}

export { DOMElement };
