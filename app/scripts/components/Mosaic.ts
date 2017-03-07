import { DOMUtils } from './DOMUtils';

class Mosaic {
  static readonly ACTIVE_CLASS = 'active';
  static readonly ITEM_CLASS = 'mosaic-item';
  static readonly DETAIL_CLASS = 'mosaic-detail';
  static readonly CONTAINER_CLASS = 'mosaic-container';
  static readonly TITLE_ATTR = 'data-mosaic-title';
  static readonly DESCRIPTION_ATTR = 'data-mosaic-description';
  static readonly IMAGE_ATTR = 'data-mosaic-image';

  public description: string;
  public image: string;
  public title: string;
  public items: NodeListOf<Element>;
  public detailContainer: HTMLElement;
  public container: HTMLElement;

  constructor(mosaic) {
    this.container = mosaic.querySelector(`.${ Mosaic.CONTAINER_CLASS }`);
    this.showDetail = this.showDetail.bind(this);
    this.setDetailContailerHeight = this.setDetailContailerHeight.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
    this.items = mosaic.querySelectorAll(`.${ Mosaic.ITEM_CLASS }`);
    this.detailContainer = mosaic.querySelector(`.${ Mosaic.DETAIL_CLASS }`);
    this.activateItems();
    this.setDetailContailerHeight();

    window.onEvent(this.setDetailContailerHeight, 1, 'resize');
  }

  public activateItems() {
    let itemsSize = this.items.length;

    for (let i = 0; i < itemsSize; i++) {
      let item = this.items[i] as HTMLElement;

      item.addEventListener('mousemove', this.showDetail);
    }
  }

  public showDetail(event) {
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

  public renderDetail() {
    DOMUtils.removeAllChildElements(this.detailContainer);

    let template = `<div>
      <div class="title">${ this.title }</div>
      <div class="description">${ this.description }</div>
      <img src="${ this.image }">
    </div>`;

    this.detailContainer.innerHTML = template;
  }

  public setDetailContailerHeight() {
    this.detailContainer.style.height = `${ this.container.offsetHeight }px`;
  }
}

export { Mosaic };
