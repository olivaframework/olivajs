import { Swiper, SwiperOptions } from './Swiper';
import { DOMUtils } from './DOMUtils';

interface CarouselOptions extends SwiperOptions {
  autoplayMs: number;
}

class Carousel extends Swiper {
  static readonly CLONED_CLASS = 'clone';
  static readonly WINDOW_EVENT = 'resize';

  public interval: number;
  public isPartialItem: boolean;
  public options: CarouselOptions;

  constructor(element: Element, options: CarouselOptions) {
    super(element, options);

    this.createClones = this.createClones.bind(this);
    this.showNext = this.showNext.bind(this);
    this.stopAutoplay = this.stopAutoplay.bind(this);
    this.autoplay = this.autoplay.bind(this);
    this.isPartialItem = false;
    this.options = options;
    this.createClones();
    this.autoplay();
    this.container.addEventListener(this.supportEvents.move, this.stopAutoplay);
    this.container.addEventListener('mouseout', this.autoplay);

    window.onEvent(Carousel.WINDOW_EVENT, this.createClones, 1);
  }

  public autoplay(): void {
    this.interval = window.setInterval(() => {
      this.showNext();

      if (this.options.createControls) {
        DOMUtils.addClassToItems(this.prevCtrls, Swiper.ACTIVE_CTRL_CLASS);
        DOMUtils.addClassToItems(this.nextCtrls, Swiper.ACTIVE_CTRL_CLASS);
      }
    }, this.options.autoplayMs);
  }

  public stopAutoplay(): void {
    clearInterval(this.interval);
  }

  public showNext(): void {
    ++this.index;
    const lastToShow = this.lastToShow();

    if (this.index <= lastToShow) {
      const currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, this.options.animationMs);

      if ((this.isPartialItem && this.index === lastToShow - 1)
        || this.index === lastToShow) {
        this.restartPosition();
      }
    }
  }

  public createClones(): void {
    let clonedAmount = this.items.length - 1 - this.lastToShow();
    const last = this.items[this.items.length - 1] as HTMLElement;
    const clons = this.container
    .querySelectorAll(`.${ Carousel.CLONED_CLASS }`);

    if (last.offsetWidth < this.container.offsetWidth && clonedAmount === 0) {
      this.isPartialItem = true;
      ++clonedAmount;
    } else {
      this.isPartialItem = false;
    }

    for (let i = 0; i <= clonedAmount; i++) {
      const currentItem = this.items[i] as HTMLElement;

      if (currentItem.offsetLeft > this.container.offsetWidth) {
        break;
      }

      const clonedItem = currentItem.cloneNode(true) as HTMLElement;

      DOMUtils.addClass(clonedItem, Carousel.CLONED_CLASS);
      this.container.appendChild(clonedItem);
    }

    DOMUtils.removeElements(clons);
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
  }

  public restartPosition(): void {
    const timeout = setTimeout(() => {
      this.animate(0, 0);
      this.index = 0;
      clearTimeout(timeout);
    }, this.options.animationMs);
  }
}

export { Carousel };
