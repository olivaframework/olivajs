class ScrollSpy {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly EVENT_ACTIVE: string = 'scroll';
  static readonly SCROLL_PERCENT: number = 25;

  public handler: HTMLElement;

  constructor(handler: HTMLElement) {
    this.handler = handler;
    this.validatePosition = this.validatePosition.bind(this);

    window.onEvent(this.validatePosition, 1, ScrollSpy.EVENT_ACTIVE);
  }

  public validatePosition(): void {
    console.log('llego');
    let scrollLimit = (window.innerHeight * ScrollSpy.SCROLL_PERCENT) / 100;

    if (window.pageYOffset > scrollLimit) {
      this.handler.classList.add(ScrollSpy.ACTIVE_CLASS);
    } else {
      this.handler.classList.remove(ScrollSpy.ACTIVE_CLASS);
    }
  }
}

export { ScrollSpy };