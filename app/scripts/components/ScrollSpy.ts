import { DOMUtils } from './DOMUtils';

class ScrollSpy {
  static readonly ACTIVE_CLASS: string = 'scrolled';
  static readonly EVENT_ACTIVE: string = 'scroll';
  static readonly SCROLL_PERCENT: number = 25;

  public handler: HTMLElement;

  constructor(handler: HTMLElement) {
    this.handler = handler;
    this.validatePosition = this.validatePosition.bind(this);

    window.onEvent(this.validatePosition, 1, ScrollSpy.EVENT_ACTIVE);
  }

  public validatePosition(): void {
    let windowPercent : number = (window.innerHeight * ScrollSpy.SCROLL_PERCENT)
     / 100;

    if (window.pageYOffset >= windowPercent
      && DOMUtils.getBodyHeight() >= window.innerHeight) {
      this.handler.classList.add(ScrollSpy.ACTIVE_CLASS);
      console.log(this.handler);
    } else {
      this.handler.classList.remove(ScrollSpy.ACTIVE_CLASS);
    }
    // this.handler.classList.contains(ScrollSpy.ACTIVE_CLASS);
  }
}

export { ScrollSpy };
