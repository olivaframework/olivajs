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
      this.element.classList.add(item);
    }
  }

  public removeClasses(classes: Array<string>): void {
    for (let item of classes) {
      this.element.classList.remove(item);
    }
  }

  public destroy(): void {
    this.element.parentNode.removeChild(this.element);
  }

  public render(node: Node): void {
    node.appendChild(this.element);
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
