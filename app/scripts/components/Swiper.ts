class Swiper {
  static readonly CONTAINER_CLASS = 'swiper-container';
  static readonly ITEM_CLASS = 'swiper-item';
  static readonly PREV_CTRL_ATRR = 'data-swiper-prev';
  static readonly NEXT_CTRL_ATRR = 'data-swiper-next';
  static readonly ACTIVE_CTRL_CLASS = 'active';
  static readonly CTRL_EVENT_ACTIVE = 'click';
  static readonly ANIMATION_MS = 300;

  private container: HTMLElement;
  private controlPrev: Element;
  private controlNext: Element;
  private index: number;
  private items: NodeListOf<Element>;

  constructor(swiper) {
    this.index = 0;
    this.container = swiper.querySelector(`.${ Swiper.CONTAINER_CLASS }`);
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.update = this.update.bind(this);
    this.controlPrev = swiper.querySelector(`[${ Swiper.PREV_CTRL_ATRR }]`);
    this.controlNext = swiper.querySelector(`[${ Swiper.NEXT_CTRL_ATRR }]`);
    this.controlPrev.addEventListener(Swiper.CTRL_EVENT_ACTIVE, this.showPrev);
    this.controlNext.addEventListener(Swiper.CTRL_EVENT_ACTIVE, this.showNext);

    this.activeControls(false, true);

    window.onResize(this.update, 1);
  }

  public animate(distance: number, velocity: number): void {
    this.container.style.transform = `translate3d(-${ distance }px, 0px, 0px)`;
    this.container.style.transitionDuration = `${ velocity }ms`;
  }

  public activeControls(activePrev: boolean, activeNext: boolean): void {
    if (activePrev) {
      this.controlPrev.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    } else {
      this.controlPrev.classList.remove(Swiper.ACTIVE_CTRL_CLASS);
    }

    if (activeNext) {
      this.controlNext.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    } else {
      this.controlNext.classList.remove(Swiper.ACTIVE_CTRL_CLASS);
    }
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

  public showPrev(): void {
    if (this.index > 0) {
      this.index = --this.index;
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, Swiper.ANIMATION_MS);
      if (this.index === 0) {
        this.activeControls(false, true);
      } else {
        this.activeControls(true, true);
      }
    }
  }

  public showNext(): void {
    if (this.index < this.lastToShow()) {
      let currentItem = this.items[this.index] as HTMLElement;
      let tempDistance = currentItem.offsetLeft + currentItem.offsetWidth;
      let containerWidth = 0;

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i] as HTMLElement;

        containerWidth = containerWidth + item.offsetWidth;
      }

      if (tempDistance < containerWidth) {
        this.animate(tempDistance, Swiper.ANIMATION_MS);
        this.activeControls(true, true);
      }

      this.index = ++this.index;
    } else if (this.index === this.lastToShow()) {
      let distance = this.container.scrollWidth - this.container.offsetWidth;

      this.animate(distance, Swiper.ANIMATION_MS);
      this.activeControls(true, false);
      this.index = ++this.index;
    }
  }

  public update(): void {
    if (this.index <= this.lastToShow()) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, 0);

      if (this.index > 0) {
        this.activeControls(true, true);
      } else {
        this.activeControls(false, true);
      }
    } else {
      this.index = this.lastToShow() + 1;
      this.animate(this.container.scrollWidth - this.container.offsetWidth, 0);
      this.activeControls(true, false);
    }
  }
}

export { Swiper };
