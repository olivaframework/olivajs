class Jump {
  static readonly ATTR: string = 'data-jump-content-id';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly SCROLL_VELOCITY_PX: number = 35;
  static readonly SCROLL_VELOCITY_MS: number = 1;

  public handler: HTMLAnchorElement;
  public element: HTMLElement;

  constructor(handler: HTMLAnchorElement) {
    this.handler = handler;
    this.element = document.getElementById(handler.getAttribute(Jump.ATTR));
    this.jump = this.jump.bind(this);
    this.handler.addEventListener(Jump.EVENT_ACTIVE, this.jump);
  }

  public jump(event): void {
    event.preventDefault();

    let bodyRect = this.getOffsetTop(document.body);
    let elementRect = this.getOffsetTop(this.element);
    let handlerRect = this.getOffsetTop(this.handler);

    let elementTop = elementRect - bodyRect;
    let handlerTop = handlerRect - bodyRect;

    if (handlerTop < elementTop) {
      this.scrollDown(handlerTop, elementTop);
    } else {
      this.scrollUp(handlerTop, elementTop);
    }
  }

  public scrollUp(init, end): void {
    let bottom = init;

    setTimeout(() => {
      if (bottom >= end) {
        bottom = bottom - this.scrollVelocity(end, init);
        window.scroll(0, bottom);
        this.scrollUp(bottom, end);
      }
    }, Jump.SCROLL_VELOCITY_MS);
  }

  public scrollDown(init: number, end: number): void {
    let top = init;
    let maxEnd = this.getBodyHeight() - window.innerHeight;
    let finalEnd = (end > maxEnd) ? maxEnd : end;

    setTimeout(() => {
      if (top <= finalEnd) {
        top = top + this.scrollVelocity(init, finalEnd);
        window.scroll(0, top);
        this.scrollDown(top, finalEnd);
      }
    }, Jump.SCROLL_VELOCITY_MS);
  }

  public scrollVelocity(from: number, to: number): number {
    let distance = to - from;
    let velocity = distance / Jump.SCROLL_VELOCITY_PX;
    let finalVelocity = (velocity > 1) ? Math.round(velocity) : 1;

    return finalVelocity;
  }

  public getOffsetTop(element: HTMLElement): number {
    let offsetTop = 0;
    let currentElement = element;

    do {
      if (!isNaN(currentElement.offsetTop)) {
        offsetTop += currentElement.offsetTop;
      }
    } while (currentElement = currentElement.offsetParent as HTMLElement);

    return offsetTop;
  }

  public getBodyHeight(): number {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
  }
}

export { Jump };
