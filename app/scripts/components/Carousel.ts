class Carousel {
  static readonly CONTAINER_CLASS = 'carousel-container';
  static readonly ITEM_CLASS = 'carousel-item';
  static readonly PREV_CTRL_ATRR = 'data-carousel-prev';
  static readonly NEXT_CTRL_ATRR = 'data-carousel-next';

  private container: HTMLElement;
  private index: number;
  private currentItem: HTMLElement;
  private items: NodeListOf<Element>;
  private controlPrev: Element;
  private controlNext: Element;
  private distance: number;

  constructor(carousel) {
    this.index = 0;
    this.distance = 0;
    this.container = carousel.querySelector(`.${ Carousel.CONTAINER_CLASS }`);
    this.items = this.container.querySelectorAll(`.${ Carousel.ITEM_CLASS }`);
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.controlPrev = carousel.querySelector(`[${ Carousel.PREV_CTRL_ATRR }]`);
    this.controlNext = carousel.querySelector(`[${ Carousel.NEXT_CTRL_ATRR }]`);
    this.controlPrev.addEventListener('click', this.showPrev);
    this.controlNext.addEventListener('click', this.showNext);
    this.activeControls();
  }

  public activeControls(): void {
    if (this.index === 0) {
      this.controlPrev.classList.remove('active');
      this.controlNext.classList.add('active');
    } else if (this.index === this.items.length - 1) {
      this.controlPrev.classList.add('active');
      this.controlNext.classList.remove('active');
    } else {
      this.controlPrev.classList.add('active');
      this.controlNext.classList.add('active');
    }
  }

  public showPrev(): void {
    let currentItem = this.items[this.index] as HTMLElement;

    if (this.index > 0) {
      this.distance = this.distance - currentItem.offsetWidth;
      this.animate(this.distance);
      this.index = --this.index;
    }

    this.activeControls();
  }

  public showNext(): void {
    let currentItem = this.items[this.index] as HTMLElement;

    if (this.index < this.items.length - 1) {
      this.distance = this.distance + currentItem.offsetWidth;
      this.index = ++this.index;
      this.animate(this.distance);
    }

    this.activeControls();
  }

  public animate(distance: number): void {
    this.container.style.transform = `translate3d(-${ distance }px, 0px, 0px)`;
    this.container.style.transitionDuration = '300ms';
  }
}

export { Carousel };
