class Tab {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly ATTR: string = 'data-tab-content-id';

  private handler: HTMLAnchorElement;
  private content: Element;

  constructor(handler: HTMLAnchorElement) {
    this.handler = handler;
    this.content = document.getElementById(handler.getAttribute(Tab.ATTR));
    this.toggle = this.toggle.bind(this);
    this.handler.addEventListener(Tab.EVENT_ACTIVE, this.toggle);
  }

  private removeActives(elements: HTMLCollection): void {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(Tab.ACTIVE_CLASS);
    }
  }

  private toggle(event: Event): void {
    event.preventDefault();

    this.removeActives(this.content.parentElement.children);
    this.removeActives(this.handler.parentElement.children);

    this.content.classList.add(Tab.ACTIVE_CLASS);
    this.handler.classList.add(Tab.ACTIVE_CLASS);
  }
}

export { Tab };
