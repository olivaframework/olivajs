import './Window';
import { DOMUtils } from './DOMUtils';

class ScrollSpy {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly EVENT_ACTIVE: string = 'scroll';
  static readonly SCROLL_PERCENT: number = 25;

  public handler: HTMLElement;

  constructor(handler: HTMLElement) {
    this.handler = handler;
    this.validatePosition = this.validatePosition.bind(this);

    window.onEvent(ScrollSpy.EVENT_ACTIVE, this.validatePosition, 1);
  }

  public validatePosition(): void {
    const scrollLimit = (window.innerHeight * ScrollSpy.SCROLL_PERCENT) / 100;

    if (window.scrollTop() > scrollLimit) {
      DOMUtils.addClass(this.handler, ScrollSpy.ACTIVE_CLASS);
    } else {
      DOMUtils.removeClass(this.handler, ScrollSpy.ACTIVE_CLASS);
    }
  }
}

export { ScrollSpy };
