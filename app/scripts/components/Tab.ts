class Tab {
  static readonly STYLE_ACTIVE_CLASS = 'active';
  static readonly TAB_ATTR = 'data-tab-content-id';
  static readonly TAB_EVENT = 'click';

  private handler: HTMLAnchorElement;
  private content: Element;

  constructor(handler: HTMLAnchorElement) {
    this.handler = handler;
    this.content = document.getElementById(handler.getAttribute(Tab.TAB_ATTR));
    this.toggle = this.toggle.bind(this);
    this.handler.addEventListener(Tab.TAB_EVENT, this.toggle);
  }

  private removeActives(elements: HTMLCollection) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(Tab.STYLE_ACTIVE_CLASS);
    }
  }

  private toggle(event: Event): void {
    event.preventDefault();

    this.removeActives(this.content.parentElement.children);
    this.removeActives(this.handler.parentElement.children);

    this.content.classList.add(Tab.STYLE_ACTIVE_CLASS);
    this.handler.classList.add(Tab.STYLE_ACTIVE_CLASS);
  }
}

export { Tab };
