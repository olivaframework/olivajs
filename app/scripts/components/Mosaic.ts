import { DOMUtils } from './DOMUtils';

class Mosaic {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly ITEM_CLASS: string = 'mosaic-item';
  static readonly DETAIL_CLASS: string = 'mosaic-detail';
  static readonly CONTAINER_CLASS: string = 'mosaic-container';
  static readonly TITLE_ATTR: string = 'data-mosaic-title';
  static readonly DESCRIPTION_ATTR: string = 'data-mosaic-description';
  static readonly IMAGE_ATTR: string = 'data-mosaic-image';
  static readonly WINDOW_EVENT: string = 'resize';
  static readonly DETAIL_TEMPLATE: string = `<div>
    <div class="title">{title}</div>
    <div class="description">{description}</div>
    <img src="{image}">
  </div>`;

  public description: string;
  public image: string;
  public title: string;
  public items: NodeListOf<Element>;
  public detailContainer: HTMLElement;
  public container: HTMLElement;

  constructor(mosaic) {
    this.showDetail = this.showDetail.bind(this);
    this.setDetailContailerHeight = this.setDetailContailerHeight.bind(this);
    this.container = mosaic.querySelector(`.${ Mosaic.CONTAINER_CLASS }`);
    this.items = mosaic.querySelectorAll(`.${ Mosaic.ITEM_CLASS }`);
    this.detailContainer = mosaic.querySelector(`.${ Mosaic.DETAIL_CLASS }`);
    this.activateItems();
    this.setDetailContailerHeight();

    window.onEvent(this.setDetailContailerHeight, 1, Mosaic.WINDOW_EVENT);
  }

  public activateItems(): void {
    let itemsSize = this.items.length;

    for (let i = 0; i < itemsSize; i++) {
      let item = this.items[i] as HTMLElement;

      item.addEventListener('mousemove', this.showDetail);
    }
  }

  public showDetail(event): void {
    DOMUtils.removeClassToItems(this.items, Mosaic.ACTIVE_CLASS);

    let item = DOMUtils.findParentElementByClass(
      event.target,
      Mosaic.ITEM_CLASS
    );

    item.classList.add(Mosaic.ACTIVE_CLASS);

    this.title = item.getAttribute(Mosaic.TITLE_ATTR);
    this.description = item.getAttribute(Mosaic.DESCRIPTION_ATTR);
    this.image = item.getAttribute(Mosaic.IMAGE_ATTR);

    this.renderDetail();
  }

  public renderDetail(): void {
    let detailTemplate = Mosaic.DETAIL_TEMPLATE
      .replace('{title}', this.title)
      .replace('{description}', this.description)
      .replace('{image}', this.image);

    if (window.isMobile()) {
      DOMUtils.removeAllChildElements(this.detailContainer);
    } else {
      DOMUtils.removeAllChildElements(this.detailContainer);
      this.detailContainer.innerHTML = detailTemplate;
    }
  }

  public setDetailContailerHeight(): void {
    this.detailContainer.style.height = `${ this.container.offsetHeight }px`;
  }

  public elementsPerRow(): number {
    return 0;
  }
}

export { Mosaic };
