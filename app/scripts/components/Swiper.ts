class Swiper {
  static readonly CONTAINER_CLASS = 'swiper-container';
  static readonly ITEM_CLASS = 'swiper-item';
  static readonly PREV_CTRL_ATRR = 'data-swiper-prev';
  static readonly NEXT_CTRL_ATRR = 'data-swiper-next';
  static readonly ACTIVE_CTRL_CLASS = 'active';
  static readonly CTRL_EVENT_ACTIVE = 'click';
  static readonly ANIMATION_MS = '300';

  private container: HTMLElement;
  private controlPrev: Element;
  private controlNext: Element;
  private index: number;
  private items: NodeListOf<Element>;
  private isLast: boolean;

  constructor(swiper) {
    this.index = 0;
    this.isLast = false;
    this.container = swiper.querySelector(`.${ Swiper.CONTAINER_CLASS }`);
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.controlPrev = swiper.querySelector(`[${ Swiper.PREV_CTRL_ATRR }]`);
    this.controlNext = swiper.querySelector(`[${ Swiper.NEXT_CTRL_ATRR }]`);
    this.controlPrev.addEventListener(Swiper.CTRL_EVENT_ACTIVE, this.showPrev);
    this.controlNext.addEventListener(Swiper.CTRL_EVENT_ACTIVE, this.showNext);
    this.activeControls(false, true);
  }

  public showPrev(): void {
    if (this.isLast) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.isLast = false;
      this.animate(currentItem.offsetLeft);
      this.activeControls(true, true);
    } else if (this.index > 0) {
      let currentItem = this.items[this.index - 1] as HTMLElement;

      this.animate(currentItem.offsetLeft);
      this.index = this.index - 1;
    }

    if (this.index === 0) {
      this.activeControls(false, true);
    }
  }

  public showNext(): void {
    if (this.index < this.items.length - 1) {
      let currentItem = this.items[this.index] as HTMLElement;
      let nextItem = this.items[this.index + 1] as HTMLElement;
      let tempDistance = currentItem.offsetLeft + currentItem.offsetWidth;

      if (this.distanceToFinal(nextItem) < this.container.offsetWidth) {
        let lastItem = this.items[this.items.length - 1] as HTMLElement;
        let distanceLastItem = lastItem.offsetLeft + lastItem.offsetWidth;

        this.animate(distanceLastItem - this.container.offsetWidth);
        this.isLast = true;
        this.activeControls(true, false);
      } else if (tempDistance < this.containerFullWidth()) {
        this.animate(tempDistance);
        this.activeControls(true, true);
        this.index = this.index + 1;
      }
    }
  }

  public animate(distance: number): void {
    this.container.style.transform = `translate3d(-${ distance }px, 0px, 0px)`;
    this.container.style.transitionDuration = `${ Swiper.ANIMATION_MS }ms`;
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

  public containerFullWidth(): number {
    let containerWidth = 0;

    for (let i = 0; i < this.items.length; i++) {
      let currentItem = this.items[i] as HTMLElement;

      containerWidth = containerWidth + currentItem.offsetWidth;
    }

    return containerWidth;
  }

  public distanceToFinal(element: Element): number {
    let currentElement = element;
    let distance = 0;

    while (currentElement) {
      let htmlElement = currentElement as HTMLElement;

      distance = distance + htmlElement.offsetWidth;
      currentElement = currentElement.nextElementSibling;
    }

    return distance;
  }
}

export { Swiper };
