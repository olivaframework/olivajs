import { DOMUtils } from './DOMUtils';

class Dropdown {
  static readonly ACTIVE_CLASS: string = 'open';
  static readonly EVENT_ACTIVE: string = 'click';

  private handler: HTMLElement;

  constructor(handler) {
    this.handler = handler;
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.handler.addEventListener(Dropdown.EVENT_ACTIVE, this.toggle);
    window.addEventListener(Dropdown.EVENT_ACTIVE, this.close);
  }

  private close(event): void {
    const isClickInside = this.handler.contains(event.target);

    if (!isClickInside) {
      DOMUtils.removeClass(this.handler, Dropdown.ACTIVE_CLASS);
    }
  }

  private toggle(): void {
    DOMUtils.toggleClass(this.handler, Dropdown.ACTIVE_CLASS);
  }
}

export { Dropdown };
