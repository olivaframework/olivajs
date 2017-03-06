import { Swiper } from './Swiper';

class Carousel extends Swiper {
  static readonly AUTOPLAY_TIME = 1200;
  static readonly CLONED_CLASS = 'clone';

  private interval: number;
  private isPartialItem: boolean;

  constructor(element) {
    super(element);

    this.createClones = this.createClones.bind(this);
    this.showNext = this.showNext.bind(this);
    this.stopAutoplay = this.stopAutoplay.bind(this);
    this.autoplay = this.autoplay.bind(this);
    this.isPartialItem = false;
    this.createClones();
    this.autoplay();
    this.container.addEventListener(this.supportEvents.move, this.stopAutoplay);
    this.container.addEventListener('mouseout', this.autoplay);
    window.onResize(this.createClones, 1);
  }

  public autoplay(): void {
    this.interval = setInterval(() => {
      this.showNext();
      this.prevCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
      this.nextCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    }, Carousel.AUTOPLAY_TIME);
  }

  public stopAutoplay(): void {
    clearInterval(this.interval);
  }

  public showNext(): void {
    this.index = ++this.index;
    let lastToShow = this.lastToShow();

    if (this.index <= lastToShow) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, Swiper.ANIMATION_MS);

      if ((this.isPartialItem && this.index === lastToShow - 1)
        || this.index === lastToShow) {
        this.restartPosition();
      }
    }
  }

  public createClones(): void {
    let clons = this.container.querySelectorAll(`.${ Carousel.CLONED_CLASS }`);
    let last = this.items[this.items.length - 1] as HTMLElement;
    let clonedAmount = this.items.length - 1 - this.lastToShow();

    if (last.offsetWidth < this.container.offsetWidth && clonedAmount === 1) {
      this.isPartialItem = true;
      clonedAmount = ++clonedAmount;
    } else {
      this.isPartialItem = false;
    }

    for (let i = 0; i <= clonedAmount; i++) {
      let currentItem = this.items[i] as HTMLElement;

      if (currentItem.offsetLeft > this.container.offsetWidth) {
        break;
      }

      let clonedItem = currentItem.cloneNode(true) as HTMLElement;

      clonedItem.classList.add(Carousel.CLONED_CLASS);
      this.container.appendChild(clonedItem);
    }

    this.removeCloned(clons);
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
  }

  public removeCloned(clonedItems) {
    let clonedAmount = clonedItems.length;

    for (let i = 0; i < clonedAmount; i++) {
      clonedItems[i].parentNode.removeChild(clonedItems[i]);
    }
  }

  public restartPosition(): void {
    let timeout = setTimeout(() => {
      this.animate(0, 0);
      this.index = 0;
      clearTimeout(timeout);
    }, Swiper.ANIMATION_MS);
  }
}

export { Carousel };
