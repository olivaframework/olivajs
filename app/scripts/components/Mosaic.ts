import { DOMUtils } from './DOMUtils';

class Mosaic {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly ITEM_CLASS: string = 'mosaic-item';
  static readonly DETAIL_CLASS: string = 'mosaic-detail';
  static readonly CONTAINER_CLASS: string = 'mosaic-container';
  static readonly TITLE_ATTR: string = 'data-mosaic-title';
  static readonly DESC_ATTR: string = 'data-mosaic-desc';
  static readonly IMAGE_ATTR: string = 'data-mosaic-image';
  static readonly WINDOW_EVENT: string = 'resize';
  static readonly DETAIL_TEMPLATE: string = `<div>
    <div class="title">{title}</div>
    <div class="desc">{desc}</div>
    <img src="{image}">
  </div>`;

  public desc: string;
  public image: string;
  public title: string;
  public items: NodeListOf<Element>;
  public detailContainer: HTMLElement;
  public mosaicContainer: HTMLElement;
  public mosaic: HTMLElement;

  constructor(mosaic) {
    this.mosaic = mosaic;
    this.items = mosaic.querySelectorAll(`.${ Mosaic.ITEM_CLASS }`);
    this.detailContainer = mosaic.querySelector(`.${ Mosaic.DETAIL_CLASS }`);
    this.mosaicContainer = mosaic.querySelector(`.${ Mosaic.CONTAINER_CLASS }`);
    this.desc = this.items[0].getAttribute(Mosaic.DESC_ATTR);
    this.image = this.items[0].getAttribute(Mosaic.IMAGE_ATTR);
    this.title = this.items[0].getAttribute(Mosaic.TITLE_ATTR);
    this.showDetail = this.showDetail.bind(this);
    this.itemsPerRow = this.itemsPerRow.bind(this);
    this.removeActives = this.removeActives.bind(this);
    this.setDetailContailerHeight = this.setDetailContailerHeight.bind(this);
    this.renderDetail();
    this.setDetailContailerHeight();

    DOMUtils.syncForEach(item => {
      item.addEventListener('mouseenter', this.showDetail);
      item.addEventListener('mouseout', this.removeActives);
    }, this.items);

    window.onEvent(this.setDetailContailerHeight, 1, Mosaic.WINDOW_EVENT);
  }

  public showDetail(event): void {
    let item = DOMUtils.findParentElementByClass(
      event.target,
      Mosaic.ITEM_CLASS
    );

    item.classList.add(Mosaic.ACTIVE_CLASS);

    this.title = item.getAttribute(Mosaic.TITLE_ATTR);
    this.desc = item.getAttribute(Mosaic.DESC_ATTR);
    this.image = item.getAttribute(Mosaic.IMAGE_ATTR);

    this.renderDetail();
  }

  public renderDetail(): void {
    let detailTemplate = Mosaic.DETAIL_TEMPLATE
      .replace('{title}', this.title)
      .replace('{desc}', this.desc)
      .replace('{image}', this.image);

    if (window.isMobile()) {
      DOMUtils.removeAllChildElements(this.detailContainer);
    } else {
      DOMUtils.removeAllChildElements(this.detailContainer);
      this.detailContainer.innerHTML = detailTemplate;
    }
  }

  public removeActives(): void {
    DOMUtils.removeClassToItems(this.items, Mosaic.ACTIVE_CLASS);
  }

  public setDetailContailerHeight(): void {
    let mosaicContainerHeigth = this.mosaicContainer.offsetHeight;

    this.detailContainer.style.height = `${ mosaicContainerHeigth }px`;
  }

  public itemsPerRow(): Array<number> {
    let itemsSize = this.items.length;
    let distance = 0;
    let itemsCount = 0;
    let itemsPerRow = [];

    for (let i = 0; i < itemsSize; i++) {
      let item = this.items[i] as HTMLElement;

      distance = distance + item.offsetWidth;

      if (distance > this.mosaicContainer.offsetWidth) {
        itemsPerRow.push(itemsCount);
        distance = item.offsetWidth;
        itemsCount = 0;
      }

      if (i < itemsSize - 1) {
        itemsCount = ++itemsCount;
      } else {
        itemsPerRow.push(itemsCount + 1);
      }
    }

    return itemsPerRow;
  }
}

export { Mosaic };
