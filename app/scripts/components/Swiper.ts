import './Window';

class Swiper {
  static readonly ACTIVE_EVENT = 'click';
  static readonly THUMBNAILS_CONTAINER_CLASS = 'thumbnails-container';
  static readonly THUMBNAIL_ITEM_CLASS = 'thumbnail-item';
  static readonly ITEM_MAGNIFY_WIDTH = '100%';
  static readonly CONTAINER_CLASS = 'swiper-container';
  static readonly ITEM_CLASS = 'swiper-item';
  static readonly PREV_CTRL_ATRR = 'data-swiper-prev';
  static readonly NEXT_CTRL_ATRR = 'data-swiper-next';
  static readonly ACTIVE_CTRL_CLASS = 'active';
  static readonly ACTIVE_EVENT_CTRL = 'click';
  static readonly ANIMATION_MS = 300;
  static readonly SWIPE_OUT_RANGE = 35;
  static readonly WINDOW_EVENT = 'resize';
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

  public container: HTMLElement;
  public firstPoint: number;
  public index: number;
  public initDistance: number;
  public items: NodeListOf<Element>;
  public nextCtrl: HTMLElement;
  public prevCtrl: HTMLElement;
  public supportEvents: any;
  public thumbnails: NodeListOf<Element>;

  constructor(swiper: Element) {
    this.actionDown = this.actionDown.bind(this);
    this.actionUp = this.actionUp.bind(this);
    this.animate = this.animate.bind(this);
    this.showByIndex = this.showByIndex.bind(this);
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.swipe = this.swipe.bind(this);
    this.update = this.update.bind(this);
    this.init(swiper);
    this.activeControlsByIndexes(swiper);
    this.activeControls();
  }

  public init(swiper: Element): void {
    this.supportEvents = window.supportTouchEvents()
      ? Swiper.TOUCH_EVENTS
      : Swiper.MOUSE_EVENTS;

    this.index = 0;
    this.initDistance = 0;

    this.container = swiper
      .querySelector(`.${ Swiper.CONTAINER_CLASS }`) as HTMLElement;
    this.prevCtrl = swiper
      .querySelector(`[${ Swiper.PREV_CTRL_ATRR }]`) as HTMLElement;
    this.nextCtrl = swiper
      .querySelector(`[${ Swiper.NEXT_CTRL_ATRR }]`) as HTMLElement;
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);

    this.prevCtrl.addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showPrev);
    this.nextCtrl.addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showNext);
    this.container.addEventListener(this.supportEvents.down, this.actionDown);
    this.container.addEventListener(this.supportEvents.up, this.actionUp);

    window.onEvent(this.update, 1, Swiper.WINDOW_EVENT);
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

    if (this.index < this.lastToShow()) {
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
          return i;
        }

        return i + 1;
      }
    }

    return totalItems;
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

    if (this.index + 1 <= lastToShow) {
      this.index = ++this.index;

      if (this.index < lastToShow) {
        let currentItem = this.items[this.index] as HTMLElement;

        this.animate(currentItem.offsetLeft, Swiper.ANIMATION_MS);
      } else {
        this.animate(this.containerFullWidth(), Swiper.ANIMATION_MS);
      }
    }

    this.activeControls();
  }

  public update(): void {
    let lastToShow = this.lastToShow();

    if (this.index < lastToShow) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, 0);
    } else {
      this.index = lastToShow;
      this.animate(this.containerFullWidth(), 0);
    }

    this.activeControls();
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

  public actionDown(downEvent: any): void {
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

  public actionUp(upEvent: any): void {
    upEvent.preventDefault();

    let distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
      ? upEvent.changedTouches[0].clientX
      : upEvent.screenX;
    let moveDistance = this.firstPoint - distanceEvent;
    let distance = moveDistance + this.initDistance;
    let lastToShow = this.lastToShow();

    for (let i = 0; i <= lastToShow; i++) {
      let item = this.items[i] as HTMLElement;
      let middleDistance = item.offsetWidth / 2;

      if (i < lastToShow && item.offsetLeft + middleDistance > distance) {
        this.animate(item.offsetLeft, Swiper.ANIMATION_MS);
        this.index = i;

        break;
      } else if (i === lastToShow) {
        this.animate(this.containerFullWidth(), Swiper.ANIMATION_MS);
        this.index = lastToShow;
      }
    }

    this.activeControls();
    this.container.removeEventListener(this.supportEvents.move, this.swipe);
  }

  public activeControlsByIndexes(swiper): void {
    let thumbsContainer = swiper
      .querySelector(`.${ Swiper.THUMBNAILS_CONTAINER_CLASS }`);

    if (thumbsContainer) {
      this.thumbnails = thumbsContainer
        .querySelectorAll(`.${ Swiper.THUMBNAIL_ITEM_CLASS }`);

      let itemsSize = this.items.length;
      let thumbnailsSize = this.thumbnails.length;

      if (itemsSize === thumbnailsSize) {
        for (let i = 0; i < itemsSize; i++) {
          let thumbnail = this.thumbnails[i] as HTMLElement;
          let item = this.items[i] as HTMLElement;

          thumbnail.addEventListener(Swiper.ACTIVE_EVENT, this.showByIndex);
          item.style.width = Swiper.ITEM_MAGNIFY_WIDTH;
        }
      } else {
        throw new Error('Error: Thumbnails and Items have different length');
      }
    }
  }

  public showByIndex(event: Event): void {
    let thumbnail = event.target as HTMLElement;
    let thumbnailsSize = this.thumbnails.length;

    while (!thumbnail.classList.contains(Swiper.THUMBNAIL_ITEM_CLASS)
      && thumbnail) {
      thumbnail = thumbnail.offsetParent as HTMLElement;
    }

    for (let i = 0; i < thumbnailsSize; i++) {
      if (this.thumbnails[i] === thumbnail) {
        let itemToShow = this.items[i] as HTMLElement;

        this.index = i;
        this.activeControls();
        this.animate(itemToShow.offsetLeft, Swiper.ANIMATION_MS);

        break;
      }
    }
  }
}

export { Swiper };
