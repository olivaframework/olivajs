import { DOMElement } from './DOMElement';

class Mosaic {
  static readonly ITEM_CLASS = 'mosaic-item';
  static readonly DETAIL_ATRR = 'data-mosaic-detail';
  static readonly TITLE_ATTR = 'data-mosaic-title';
  static readonly DESCRIPTION_ATTR = 'data-mosaic-description';
  static readonly IMAGE_SOURCE_ATTR = 'data-mosaic-image-source';

  public items: NodeListOf<Element>;
  public detailContainer: HTMLElement;

  constructor(mosaic) {
    this.showInfo = this.showInfo.bind(this);
    this.items = mosaic.querySelectorAll(`.${ Mosaic.ITEM_CLASS }`);
    this.detailContainer = mosaic.querySelector(`.${ Mosaic.DETAIL_ATRR }`);
    this.activateItems();
  }

  public activateItems() {
    let itemsSize = this.items.length;

    for (let i = 0; i < itemsSize; i++) {
      let item = this.items[i] as HTMLElement;

      item.addEventListener('click', this.showInfo);
    }
  }

  public showInfo(event) {
    let item = event.target as HTMLElement;

    while (!item.classList.contains(Mosaic.ITEM_CLASS) && item) {
      item = item.offsetParent as HTMLElement;
    }

    let title = item.getAttribute(Mosaic.TITLE_ATTR);
    //let description = item.getAttribute(Mosaic.DESCRIPTION_ATTR);
    //let imageSource = item.getAttribute(Mosaic.IMAGE_SOURCE_ATTR);
    let detailDOM = new DOMElement('div');

    detailDOM.getElement().textContent = title;
  }
}

export { Mosaic };
