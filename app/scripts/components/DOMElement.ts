import { DOMUtils } from './DOMUtils';

interface Events {
  callback: () => void;
  name: string;
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

  public addClasses(classes: Array<string>): void {
    for (let item of classes) {
      DOMUtils.addClass(this.element, item);
    }
  }

  public removeClasses(classes: Array<string>): void {
    for (let item of classes) {
      DOMUtils.removeClass(this.element, item);
    }
  }

  public setStyles(styles: Object): void {
    for (let property in styles) {
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
    let childrenNodes = node.children;

    node.insertBefore(this.element, childrenNodes[index]);
  }

  public addEvents(events: Array<Events>): void {
    for (let item of events) {
      this.element.addEventListener(item.name, item.callback);
    }
  }

  public removeEvents(events: Array<Events>): void {
    for (let item of events) {
      this.element.removeEventListener(item.name, item.callback);
    }
  }
}

export { DOMElement };
