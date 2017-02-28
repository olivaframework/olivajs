import { Swiper } from './Swiper';

class Carousel extends Swiper {
  static readonly AUTOPLAY_TIME = 1500;
  static readonly CLONED_ITEM_CLASS = 'item-clone';

  private interval;

  constructor(element) {
    super(element);
    this.createClones = this.createClones.bind(this);
    this.createClones();
    this.interval = this.autoplay();
    this.container.addEventListener(this.supportEvents.move, () => {
      clearInterval(this.interval);
    });
    this.container.addEventListener('mouseout', () => {
      this.interval = this.autoplay();
    });

    window.onResize(this.createClones, 1);
  }

  public autoplay() {
    return setInterval(() => {
      this.showNext();
      this.prevCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
      this.nextCtrl.classList.add(Swiper.ACTIVE_CTRL_CLASS);
    }, Carousel.AUTOPLAY_TIME);
  }

  public showNext() {
    this.index = ++this.index;

    if (this.index <= this.lastToShow() + 1) {
      let currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, Swiper.ANIMATION_MS);

      if (this.index === this.lastToShow() + 1) {
        setTimeout(() => {
          this.animate(0, 0);
          this.index = 0;
        }, Swiper.ANIMATION_MS);
      }
    }
  }

  public createClones(): void {
    let clonedItems = this.container
      .querySelectorAll(`.${ Carousel.CLONED_ITEM_CLASS }`);
    let itemsLength = this.items.length - 1;
    let numToCloned = itemsLength - this.lastToShow();

    for (let i = 0; i < numToCloned; i++) {
      let currentItem = this.items[i] as HTMLElement;

      if (currentItem.offsetLeft <= this.container.offsetWidth) {
        let newNode = currentItem.cloneNode(true);
        let newItem = newNode as HTMLElement;

        newItem.classList.add(Carousel.CLONED_ITEM_CLASS);
        this.container.appendChild(newItem);
      }
    }

    for (let i = 0; i < clonedItems.length; i++) {
      clonedItems[i].parentNode.removeChild(clonedItems[i]);
    }

    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
  }
}

export { Carousel };
