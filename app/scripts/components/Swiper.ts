class Swiper {
  static readonly CONTAINER_CLASS = 'swiper-container';
  static readonly ITEM_CLASS = 'swiper-item';
  static readonly PREV_CTRL_ATRR = 'data-swiper-prev';
  static readonly NEXT_CTRL_ATRR = 'data-swiper-next';
  static readonly ACTIVE_CTRL_CLASS = 'active';
  static readonly ACTIVE_EVENT_CTRL = 'click';
  static readonly ANIMATION_MS = 300;
  static readonly SWIPE_OUT_RANGE = 35;
  static readonly TOUCH_EVENTS = {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend'
  };
  static readonly MOUSE_EVENTS = {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup'
  };

  protected container: HTMLElement;
  protected firstPoint: number;
  protected index: number;
  protected initDistance: number;
  protected items: NodeListOf<Element>;
  protected nextCtrl: HTMLElement;
  protected prevCtrl: HTMLElement;
  protected supportEvents: any;

  constructor(swiper: Element) {
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.animate = this.animate.bind(this);
    this.update = this.update.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.swipe = this.swipe.bind(this);
    this.init(swiper);
    this.activeControls();
  }

  public init(swiper: Element): void {
    this.supportEvents = window.supportTouchEvents()
      ? Swiper.TOUCH_EVENTS
      : Swiper.MOUSE_EVENTS;

    this.index = 0;
    this.initDistance = 0;

    let container = swiper.querySelector(`.${ Swiper.CONTAINER_CLASS }`);
    let prevCtrl = swiper.querySelector(`[${ Swiper.PREV_CTRL_ATRR }]`);
    let nextCtrl = swiper.querySelector(`[${ Swiper.NEXT_CTRL_ATRR }]`);

    this.items = container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
    this.container = container as HTMLElement;
    this.prevCtrl = prevCtrl as HTMLElement;
    this.nextCtrl = nextCtrl as HTMLElement;

    this.prevCtrl.addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showPrev);
    this.nextCtrl.addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showNext);
    this.container.addEventListener(this.supportEvents.down, this.mouseDown);
    this.container.addEventListener(this.supportEvents.up, this.mouseUp);

    window.onResize(this.update, 1);
  }

  public animate(distance: number, velocity: number): void {
    let translate = `translate3d(${ -1 * distance }px, 0px, 0px)`;

    this.container.style.transform = translate;
    this.container.style.transitionDuration = `${ velocity }ms`;
  }

  public activeControls() {
    if (this.index > 0) {
      this.prevCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    } else {
      this.prevCtrl.classList.remove(Swiper.ACTIVE_CTRL_CLASS);
    }

    if (this.index <= this.lastToShow()) {
      this.nextCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    } else {
      this.nextCtrl.classList.remove(Swiper.ACTIVE_CTRL_CLASS);
    }
  }

  public containerFullWidth(): number {
    return this.container.scrollWidth - this.container.offsetWidth;
  }

  public lastToShow(): number {
    let distance = 0;
    let totalItems = this.items.length - 1;

    for (let i = totalItems; i >= 0; i--) {
      let item = this.items[i] as HTMLElement;

      distance = distance + item.offsetWidth;

      if (distance > this.container.offsetWidth) {
        if (distance < this.container.offsetWidth + totalItems) {
          return i - 1;
        }

        return i;
      }
    }

    return totalItems;
  }

  public swipe(moveEvent: any): void {
    moveEvent.preventDefault();

    let distanceEvent = (this.supportEvents.move === Swiper.TOUCH_EVENTS.move)
      ? moveEvent.touches[0].clientX
      : moveEvent.screenX;

    let distance = this.firstPoint - distanceEvent + this.initDistance;
    let outRange = this.container.offsetWidth / Swiper.SWIPE_OUT_RANGE;
    let minDistance = Math.round(outRange) * -1;
    let maxDistance = outRange + this.containerFullWidth();

    if (distance < minDistance) {
      distance = minDistance;
    } else if (distance > maxDistance) {
      distance = maxDistance;
    }

    this.animate(distance, 0);
  }

  public showPrev(): void {
    if (this.index > 0) {
      this.index = --this.index;
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, Swiper.ANIMATION_MS);
      this.activeControls();
    }
  }

  public showNext(): void {
    let lastToShow = this.lastToShow();

    if (this.index < lastToShow) {
      let currentItem = this.items[this.index] as HTMLElement;
      let tempDistance = currentItem.offsetLeft + currentItem.offsetWidth;
      let containerWidth = 0;

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i] as HTMLElement;

        containerWidth = containerWidth + item.offsetWidth;
      }

      if (tempDistance < containerWidth) {
        this.animate(tempDistance, Swiper.ANIMATION_MS);
      }

      this.index = ++this.index;
    } else if (this.index === lastToShow) {
      this.animate(this.containerFullWidth(), Swiper.ANIMATION_MS);
      this.index = ++this.index;
    }

    this.activeControls();
  }

  public update(): void {
    let lastToShow = this.lastToShow();

    if (this.index <= lastToShow) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, 0);
    } else {
      this.index = lastToShow + 1;
      this.animate(this.containerFullWidth(), 0);
    }

    this.activeControls();
  }

  public mouseDown(downEvent: any): void {
    downEvent.preventDefault();
    let transform = this.container.style.transform;

    if (transform) {
      transform = transform.split('(')[1];
      transform = transform.split(')')[0];
      transform = transform.split(',')[0];
      transform = transform.replace('-', '');
      transform = transform.replace('px', '');
      this.initDistance = Number(transform);
    } else {
      this.initDistance = 0;
    }

    this.firstPoint = (this.supportEvents.down === Swiper.TOUCH_EVENTS.down)
     ? downEvent.touches[0].clientX
     : downEvent.screenX;
    this.container.addEventListener(this.supportEvents.move, this.swipe);
  }

  public mouseUp(upEvent: any): void {
    upEvent.preventDefault();

    let distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
      ? upEvent.changedTouches[0].clientX
      : upEvent.screenX;
    let distance = this.firstPoint - distanceEvent + this.initDistance;
    let lastToShow = this.lastToShow();

    for (let i = 0; i <= lastToShow; i++) {
      let item = this.items[i] as HTMLElement;
      let middleDistance = item.offsetWidth / 2;

      if (item.offsetLeft + middleDistance > distance) {
        this.animate(item.offsetLeft, Swiper.ANIMATION_MS);
        this.index = i;

        break;
      } else if (i === lastToShow) {
        this.animate(this.containerFullWidth(), Swiper.ANIMATION_MS);
        this.index = lastToShow + 1;
      }
    }

    this.activeControls();
    this.container.removeEventListener(this.supportEvents.move, this.swipe);
  }
}

export { Swiper };
