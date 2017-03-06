import { Swiper } from './Swiper';

class Gallery extends Swiper {
  static readonly ACTIVE_EVENT = 'click';
  static readonly ANIMATION_MS = 300;
  static readonly CONTAINER_CLASS = 'thumbnails-container';
  static readonly ITEM_CLASS = 'thumbnail-item';

  public thumbnails: NodeListOf<Element>;

  constructor(swiper) {
    super(swiper);

    let container = swiper.querySelector(`.${ Gallery.CONTAINER_CLASS }`);

    this.thumbnails = container.querySelectorAll(`.${ Gallery.ITEM_CLASS }`);
    this.showIndex = this.showIndex.bind(this);
    this.setIndexes();
  }

  public setIndexes(): void {
    let thumbnailsSize = this.thumbnails.length;

    for (let i = 0; i < thumbnailsSize; i++) {
      let currentThumbnail = this.thumbnails[i] as HTMLElement;

      currentThumbnail.addEventListener(Gallery.ACTIVE_EVENT, this.showIndex);
    }
  }

  public showIndex(event: Event): void {
    let thumbnail = event.target as HTMLElement;
    let thumbnailsSize = this.thumbnails.length;

    while (!thumbnail.classList.contains(Gallery.ITEM_CLASS) && thumbnail) {
      thumbnail = thumbnail.offsetParent as HTMLElement;
    }

    for (let i = 0; i < thumbnailsSize; i++) {
      if (this.thumbnails[i] === thumbnail) {
        let itemToShow = this.items[i] as HTMLElement;

        this.index = i;
        this.activeControls();
        this.animate(itemToShow.offsetLeft, Gallery.ANIMATION_MS);

        break;
      }
    }
  }
}

export { Gallery };
