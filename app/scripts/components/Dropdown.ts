class Dropdown {
  static readonly ATTR = 'data-dropdown';
  static readonly ACTIVE_CLASS = 'open';
  static readonly CONTAINER_CLASS = 'dropdown-container';
  static readonly EVENT_ACTIVE: string = 'click';

  private handler: HTMLElement;
  private container: HTMLElement;

  constructor(handler) {
    this.handler = handler;
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.handler.addEventListener(Dropdown.EVENT_ACTIVE, this.toggle);
    window.addEventListener(Dropdown.EVENT_ACTIVE, this.close);
  }

  public close(event): void {
    let isClickInside = this.handler.contains(event.target);

    if (!isClickInside) {
      this.handler.classList.remove(Dropdown.ACTIVE_CLASS);
    }
  }

  public toggle(): void {
    this.handler.classList.toggle(Dropdown.ACTIVE_CLASS);
  }
}

export { Dropdown };
