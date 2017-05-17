import { DOMUtils } from './DOMUtils';
import { Swiper } from './Swiper';

class Tab {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly ATTR: string = 'data-tab-content-id';

  public handler: HTMLAnchorElement;
  public content: Element;
  public swipers: NodeListOf<Element>;

  constructor(handler: HTMLAnchorElement) {
    this.handler = handler;
    this.content = document.getElementById(handler.getAttribute(Tab.ATTR));
    this.toggle = this.toggle.bind(this);
    this.handler.addEventListener(Tab.EVENT_ACTIVE, this.toggle);
  }

  public updateSwipers() {
    const swipers = this.content
      .querySelectorAll(`[${ Swiper.SWIPER_UID_ATTR }]`);

    DOMUtils.syncForEach(swiper => {
      const uId = swiper.getAttribute(Swiper.SWIPER_UID_ATTR);

      DOMUtils.dispatchCustomEvent(uId, swiper);
    }, swipers);
  }

  public toggle(event): void {
    event.preventDefault();

    if (!DOMUtils.containsClass(this.handler, Tab.ACTIVE_CLASS)) {
      const contentItems = this.content.parentElement.children;
      const handlerItems = this.handler.parentElement.children;

      DOMUtils.removeClassToItems(contentItems, Tab.ACTIVE_CLASS);
      DOMUtils.removeClassToItems(handlerItems, Tab.ACTIVE_CLASS);

      DOMUtils.addClass(this.content, Tab.ACTIVE_CLASS);
      DOMUtils.addClass(this.handler, Tab.ACTIVE_CLASS);

      this.updateSwipers();
    }
  }
}

export { Tab };
