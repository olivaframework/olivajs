class Tab {
  static readonly TAB_CLASS_ACTIVE = 'active';
  static readonly TAB_ATTR = 'data-tab';

  private handler: HTMLAnchorElement;
  private content: Element;

  constructor(handler: HTMLAnchorElement) {
    this.handler = handler;
    this.content = document.querySelector(handler.getAttribute(Tab.TAB_ATTR));
    this.toggle = this.toggle.bind(this);
    this.handler.addEventListener('click', this.toggle);
  }

  private toggle(event: Event): void {
    event.preventDefault();

    this.removeActives(this.content.parentElement.children);
    this.removeActives(this.handler.parentElement.children);

    this.content.classList.add(Tab.TAB_CLASS_ACTIVE);
    this.handler.classList.add(Tab.TAB_CLASS_ACTIVE);
  }

  private removeActives(elements: HTMLCollection) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(Tab.TAB_CLASS_ACTIVE);
    }
  }
}

export { Tab };
