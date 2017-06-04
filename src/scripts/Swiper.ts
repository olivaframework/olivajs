import './Window';
import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';

interface SwiperEvents {
  click: string;
  down: string;
  enter: string;
  move: string;
  out: string;
  up: string;
}

interface SwiperOptions {
  activateTumbnails: boolean;
  animationMs: number;
  autoplay: boolean;
  autoplayMs: number;
  changePerPage: boolean;
  createControls: boolean;
  loop: boolean;
  onChange: (index: number) => void;
  nextCtrlClasses: string[];
  prevCtrlClasses: string[];
  showBullets: boolean;
}

class Swiper {
  static readonly UID_ATTR = 'data-swiper-uid';
  static readonly CLONED_CLASS = 'clone';
  static readonly ACTIVE_EVENT: string = 'click';
  static readonly THUMBNAILS_CONTAINER_CLASS: string = 'thumbnails-container';
  static readonly THUMBNAIL_ITEM_CLASS: string = 'thumbnail-item';
  static readonly ITEM_MAGNIFY_WIDTH: string = '100%';
  static readonly SWIPER_CLASS: string = 'swiper-section';
  static readonly CONTAINER_CLASS: string = 'swiper-container';
  static readonly ITEM_CLASS: string = 'swiper-item';
  static readonly ITEM_ACTIVE_CLASS: string = 'active';
  static readonly CTRLS_CONTAINER_CLASS: string = 'swiper-controls-container';
  static readonly NEXT_CTRL_ATTR: string = 'data-swiper-next-control';
  static readonly PREV_CTRL_ATTR: string = 'data-swiper-prev-control';
  static readonly ACTIVE_CTRL_CLASS: string = 'active';
  static readonly ACTIVE_EVENT_CTRL: string = 'click';
  static readonly BULLET_ATTR: string = 'data-swiper-go-page';
  static readonly BULLET_CLASS: string = 'swiper-bullet';
  static readonly SWIPE_OUT_PERCENT: number = 10;
  static readonly SWIPE_PERCENT_ADJUST: number = 10;
  static readonly WINDOW_EVENT: string = 'resize';
  static readonly TOUCH_EVENTS: SwiperEvents = {
    click: 'touchend',
    down: 'touchstart',
    enter: 'touchstart',
    move: 'touchmove',
    out: 'touchend',
    up: 'touchend'
  };
  static readonly MOUSE_EVENTS: SwiperEvents = {
    click: 'click',
    down: 'mousedown',
    enter: 'mouseenter',
    move: 'mousemove',
    out: 'mouseout',
    up: 'mouseup'
  };

  public container: HTMLElement;
  public firstPointX: number;
  public firstPointY: number;
  public index: number;
  public initDistance: number;
  public traveledDistance: number;
  public items: NodeListOf<Element>;
  public nextCtrls: NodeListOf<Element>;
  public prevCtrls: NodeListOf<Element>;
  public controlsContainer: DOMElement;
  public swiper: HTMLElement;
  public supportEvents: SwiperEvents;
  public thumbnails: NodeListOf<Element>;
  public options: SwiperOptions;
  public bulletsContainer: DOMElement;
  public lastIndexToShow: number;
  public itemsPerPage: number[];
  public interval: number;
  public uid: string;

  constructor(swiper: Element, options: SwiperOptions) {
    this.actionDown = this.actionDown.bind(this);
    this.actionUp = this.actionUp.bind(this);
    this.activateSwipe = this.activateSwipe.bind(this);
    this.animate = this.animate.bind(this);
    this.updateByEvent = this.updateByEvent.bind(this);
    this.showByIndex = this.showByIndex.bind(this);
    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this.changePageByBullet = this.changePageByBullet.bind(this);
    this.swipe = this.swipe.bind(this);
    this.update = this.update.bind(this);
    this.cancelRedirect = this.cancelRedirect.bind(this);
    this.stopAutoplay = this.stopAutoplay.bind(this);
    this.autoplay = this.autoplay.bind(this);

    this.init(swiper);
    this.initFeatures(swiper, options);
  }

  public init(swiper: Element): void {
    this.supportEvents = window.supportTouchEvents()
      ? Swiper.TOUCH_EVENTS
      : Swiper.MOUSE_EVENTS;

    this.index = 0;
    this.initDistance = 0;
    this.traveledDistance = 0;
    this.uid = `swiper-${ new Date().valueOf().toString() }`;

    this.swiper = swiper
      .querySelector(`.${ Swiper.SWIPER_CLASS }`) as HTMLElement;
    this.container = swiper
      .querySelector(`.${ Swiper.CONTAINER_CLASS }`) as HTMLElement;
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);

    DOMUtils.addClass(this.items[this.index], Swiper.ITEM_ACTIVE_CLASS);

    this.lastIndexToShow = this.lastToShow();
    this.itemsPerPage = DOMUtils.itemsPerSection(this.items, this.container);

    this.swiper.setAttribute(Swiper.UID_ATTR, this.uid);
    this.swiper.addEventListener(this.uid, this.updateByEvent);
    this.swiper.addEventListener(this.supportEvents.down, this.actionDown);
    this.swiper.addEventListener(this.supportEvents.click, this.cancelRedirect);

    window.onEvent(Swiper.WINDOW_EVENT, this.update, 100);
  }

  public initFeatures(swiper: Element, options: SwiperOptions): void {
    this.options = options;

    if (this.options.activateTumbnails) {
      this.activateControlsByIndexes(swiper);
    }

    if (this.options.createControls || this.options.showBullets) {
      this.controlsContainer = new DOMElement('div');
      this.controlsContainer.addClasses([Swiper.CTRLS_CONTAINER_CLASS]);
      this.controlsContainer.render(this.swiper.parentNode);

      if (this.options.createControls) {
        this.createControls();
        this.activateControls();
      }

      if (this.options.showBullets) {
        this.bulletsContainer = new DOMElement('div');
        this.bulletsContainer.addClasses(['swiper-bullets-container']);
        this.bulletsContainer.render(this.controlsContainer.getElement());
        this.createBullets();
        this.activateBullets();
      }
    }

    if (this.options.loop) {
      this.createClones();
      this.goToPage(1, 0);
    }

    if (this.options.autoplay) {
      this.autoplay();

      this.container.addEventListener(
        this.supportEvents.enter, this.stopAutoplay
      );
    }

    this.setControls();
  }

  public updateIndex(index: number) {
    if (this.index !== index) {
      this.index = index;

      DOMUtils.removeClassToItems(this.items, Swiper.ITEM_ACTIVE_CLASS);

      window.setTimeout(() => {
        DOMUtils.addClass(this.items[this.index], Swiper.ITEM_ACTIVE_CLASS);

        if (this.options.onChange !== null) {
          this.options.onChange(this.index);
        }
      }, this.options.animationMs);
    }
  }

  public updateByEvent(): void {
    this.lastIndexToShow = this.lastToShow();
    this.itemsPerPage = DOMUtils.itemsPerSection(this.items, this.container);

    if (this.options.loop) {
      const amountFirstPage = this.itemsPerPage[0];
      const newIndex = (amountFirstPage > 1) ? this.itemsPerPage[0] : 1;
      const currentItem = this.items[newIndex] as HTMLElement;

      this.updateIndex(newIndex);

      if (currentItem) {
        this.animate(currentItem.offsetLeft, 0);
      }
    } else {
      this.updateIndex(0);
      this.animate(0, 0);
    }

    if (this.options.showBullets) {
      this.createBullets();
    }

    if (this.options.loop) {
      this.createClones();
    }

    this.activateBullets();
    this.activateControls();
  }

  public cancelRedirect(event: any) {
    const distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
      ? event.changedTouches[0].clientX
      : event.screenX;

    this.traveledDistance = this.firstPointX - distanceEvent;

    if (this.traveledDistance !== 0
      && this.supportEvents.down === Swiper.MOUSE_EVENTS.down) {
      event.preventDefault();
    }
  }

  public animate(distance: number, velocity: number): void {
    const translate = `translate3d(${ -1 * distance }px, 0px, 0px)`;

    this.container.style.transform = translate;
    this.container.style.transitionDuration = `${ velocity }ms`;
  }

  public createBullets(): void {
    this.bulletsContainer.removeAllChildren();

    let init = 0;
    let end = this.itemsPerPage.length;

    if (this.options.loop) {
      ++init;
      --end;
    }

    for (let i = init; i < end; i++) {
      const bullet = new DOMElement('div');

      bullet.addClasses([Swiper.BULLET_CLASS]);
      bullet.render(this.bulletsContainer.getElement());
      bullet.addEvents([{
        callback: this.changePageByBullet,
        name: 'click'
      }]);
      bullet.setAttributes([{
        name: Swiper.BULLET_ATTR,
        value: i.toString()
      }]);
    }
  }

  public activateControls(): void {
    if (this.nextCtrls && this.prevCtrls) {
      if (this.index > 0) {
        DOMUtils.addClassToItems(this.prevCtrls, Swiper.ACTIVE_CTRL_CLASS);
      } else {
        DOMUtils.removeClassToItems(this.prevCtrls, Swiper.ACTIVE_CTRL_CLASS);
      }

      if (this.index < this.lastIndexToShow) {
        DOMUtils.addClassToItems(this.nextCtrls, Swiper.ACTIVE_CTRL_CLASS);
      } else {
        DOMUtils.removeClassToItems(this.nextCtrls, Swiper.ACTIVE_CTRL_CLASS);
      }
    }
  }

  public setControls(): void {
    const swiper = this.swiper.parentNode as HTMLElement;

    this.nextCtrls = swiper.querySelectorAll(`[${ Swiper.NEXT_CTRL_ATTR }]`);
    this.prevCtrls = swiper.querySelectorAll(`[${ Swiper.PREV_CTRL_ATTR }]`);

    for (let i = 0; i < this.nextCtrls.length; i++) {
      this.nextCtrls[i]
        .addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showNext);
    }

    for (let i = 0; i < this.prevCtrls.length; i++) {
      this.prevCtrls[i]
        .addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showPrev);
    }
  }

  public createControls(): void {
    const prevCtrl = new DOMElement('div');
    const nextCtrl = new DOMElement('div');

    prevCtrl.addClasses(this.options.prevCtrlClasses);
    nextCtrl.addClasses(this.options.nextCtrlClasses);
    nextCtrl.setAttributes([{
      name: Swiper.NEXT_CTRL_ATTR,
      value: ''
    }]);
    prevCtrl.setAttributes([{
      name: Swiper.PREV_CTRL_ATTR,
      value: ''
    }]);
    prevCtrl.render(this.controlsContainer.getElement());
    nextCtrl.render(this.controlsContainer.getElement());
  }

  public containerFullWidth(): number {
    return this.container.scrollWidth - this.container.offsetWidth;
  }

  public lastToShow(): number {
    let distance = 0;
    const totalItems = this.items.length - 1;

    for (let i = totalItems; i >= 0; i--) {
      const item = this.items[i] as HTMLElement;

      distance = distance + item.offsetWidth;

      if (distance > this.container.offsetWidth) {
        if (distance < this.container.offsetWidth + totalItems) {
          return i;
        }

        return i + 1;
      }
    }

    return totalItems;
  }

  public showPrev(): void {
    const amountFirstPage = this.itemsPerPage[0];

    if (this.options.loop && this.index === amountFirstPage) {
      this.animate(this.containerFullWidth(), 0);
      this.updateIndex(this.lastIndexToShow);
      this.activateBullets();
      this.activateControls();
      this.showPrev();

      return;
    }

    if (this.index > 0) {
      if (this.options.changePerPage) {
        const page = this.getCurrentPage();

        this.goToPage(page - 1, this.options.animationMs);
      } else {
        const newIndex = this.index - 1;
        const currentItem = this.items[newIndex] as HTMLElement;

        this.updateIndex(newIndex);
        this.animate(currentItem.offsetLeft, this.options.animationMs);
      }
    }

    this.activateBullets();
    this.activateControls();
  }

  public showNext(): void {
    const amountLastPage = this.itemsPerPage[this.itemsPerPage.length - 1];

    if (this.options.loop
      && this.index >= (this.items.length - (amountLastPage * 2))) {
      this.animate(0, 0);
      this.updateIndex(0);
      this.activateBullets();
      this.activateControls();
      this.showNext();

      return;
    }

    const newIndex = this.index + 1;

    if (newIndex <= this.lastIndexToShow) {
      if (this.options.changePerPage) {
        const page = this.getCurrentPage();

        this.goToPage(page + 1, this.options.animationMs);
      } else {
        this.updateIndex(newIndex);

        if (newIndex < this.lastIndexToShow) {
          const currentItem = this.items[newIndex] as HTMLElement;

          this.animate(currentItem.offsetLeft, this.options.animationMs);
        } else {
          this.animate(this.containerFullWidth(), this.options.animationMs);
        }
      }
    }

    this.activateBullets();
    this.activateControls();
  }

  public update(): void {
    this.lastIndexToShow = this.lastToShow();
    this.itemsPerPage = DOMUtils.itemsPerSection(this.items, this.container);

    if (this.index < this.lastIndexToShow) {
      const currentItem = this.items[this.index] as HTMLElement;

      this.animate(currentItem.offsetLeft, 0);
    } else {
      this.updateIndex(this.lastIndexToShow);
      this.animate(this.containerFullWidth(), 0);
    }

    if (this.options.showBullets) {
      this.createBullets();
    }

    if (this.options.loop) {
      this.createClones();
    }

    this.activateBullets();
    this.activateControls();
  }

  public swipe(moveEvent: any): void {
    moveEvent.preventDefault();
    moveEvent.stopPropagation();

    const distanceEvent = (this.supportEvents.move === Swiper.TOUCH_EVENTS.move)
      ? moveEvent.touches[0].clientX
      : moveEvent.screenX;

    let distance = this.firstPointX - distanceEvent + this.initDistance;
    const containerWidth = this.container.offsetWidth;
    const outRange = containerWidth / 100 * Swiper.SWIPE_OUT_PERCENT;
    const minDistance = outRange * -1;
    const maxDistance = outRange + this.containerFullWidth();

    if (distance < minDistance) {
      distance = minDistance;
    } else if (distance > maxDistance) {
      distance = maxDistance;
    }

    this.animate(distance, 0);
  }

  public actionDown(downEvent: any): void {
    if (this.supportEvents.down === Swiper.MOUSE_EVENTS.down) {
      downEvent.preventDefault();
    }

    this.firstPointY = (this.supportEvents.down === Swiper.TOUCH_EVENTS.down)
      ? downEvent.touches[0].clientY
      : downEvent.screenY;

    this.firstPointX = (this.supportEvents.down === Swiper.TOUCH_EVENTS.down)
      ? downEvent.touches[0].clientX
      : downEvent.screenX;

    let transform = this.container.style.transform;

    if (transform) {
      transform = transform.split('(')[1];
      transform = transform.split(')')[0];
      transform = transform.split(',')[0];
      transform = transform.replace('-', '');
      transform = transform.replace('px', '');
      this.initDistance = Number(transform);
    } else {
      this.initDistance = 0;
    }

    this.swiper.addEventListener(this.supportEvents.move, this.activateSwipe);
    this.swiper.addEventListener(this.supportEvents.up, () => {
      this.swiper.removeEventListener(
        this.supportEvents.move, this.activateSwipe
      );
    });
  }

  public activateSwipe(moveEvent: any): void {
    const distanceY = (this.supportEvents.move === Swiper.TOUCH_EVENTS.move)
      ? moveEvent.touches[0].clientY
      : moveEvent.screenY;

    if (Math.abs(this.firstPointY - distanceY) < 5) {
      this.swiper.addEventListener(this.supportEvents.move, this.swipe);
      this.swiper.addEventListener(this.supportEvents.up, this.actionUp);
      window.addEventListener(this.supportEvents.move, this.swipe);
      window.addEventListener(this.supportEvents.up, this.actionUp);
    }

    this.swiper.removeEventListener(
      this.supportEvents.move, this.activateSwipe
    );
  }

  public actionUp(upEvent: any): void {
    const distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
      ? upEvent.changedTouches[0].clientX
      : upEvent.screenX;

    this.traveledDistance = this.firstPointX - distanceEvent;

    const distance = this.traveledDistance + this.initDistance;

    for (let i = 0; i <= this.lastIndexToShow; i++) {
      const item = this.items[i] as HTMLElement;
      const ajustDistance = (item.offsetWidth * Swiper.SWIPE_PERCENT_ADJUST)
        / 100;
      const minDistance = this.traveledDistance > 0
        ? item.offsetLeft + ajustDistance
        : item.offsetLeft + item.offsetWidth - ajustDistance;

      if (i < this.lastIndexToShow && minDistance > distance) {
        this.animate(item.offsetLeft, this.options.animationMs);
        this.updateIndex(i);

        break;
      } else if (i === this.lastIndexToShow) {
        this.animate(this.containerFullWidth(), this.options.animationMs);
        this.updateIndex(this.lastIndexToShow);
      }
    }

    this.activateBullets();
    this.activateControls();
    this.swiper.removeEventListener(this.supportEvents.move, this.swipe);
    this.swiper.removeEventListener(this.supportEvents.up, this.actionUp);
    window.removeEventListener(this.supportEvents.move, this.swipe);
    window.removeEventListener(this.supportEvents.up, this.actionUp);
  }

  public activateControlsByIndexes(swiper): void {
    const thumbsContainer = swiper
      .querySelector(`.${ Swiper.THUMBNAILS_CONTAINER_CLASS }`);

    this.thumbnails = thumbsContainer
      .querySelectorAll(`.${ Swiper.THUMBNAIL_ITEM_CLASS }`);

    const itemsSize = this.items.length;
    const thumbnailsSize = this.thumbnails.length;

    if (itemsSize === thumbnailsSize) {
      for (let i = 0; i < itemsSize; i++) {
        const thumbnail = this.thumbnails[i] as HTMLElement;
        const item = this.items[i] as HTMLElement;

        thumbnail.addEventListener(Swiper.ACTIVE_EVENT, this.showByIndex);
        item.style.width = Swiper.ITEM_MAGNIFY_WIDTH;
      }
    } else {
      throw new Error('Error: Thumbnails and Items have different length');
    }
  }

  public showByIndex(event: Event): void {
    const target = event.target as HTMLElement;
    const thumbnailsSize = this.thumbnails.length;
    const thumbnail = DOMUtils.findParentElementByClass(
      target,
      Swiper.THUMBNAIL_ITEM_CLASS
    );

    for (let i = 0; i < thumbnailsSize; i++) {
      if (this.thumbnails[i] === thumbnail) {
        const itemToShow = this.items[i] as HTMLElement;

        this.updateIndex(i);
        this.activateBullets();
        this.activateControls();
        this.animate(itemToShow.offsetLeft, this.options.animationMs);

        break;
      }
    }
  }

  public changePageByBullet(event: Event): void {
    const target = event.target as Element;
    const pageNumber = parseInt(target.getAttribute(Swiper.BULLET_ATTR));

    this.goToPage(pageNumber, this.options.animationMs);
  }

  public getCurrentPage(): number {
    let page = 0;
    let itemsPerPage = 0;
    const newIndex = this.index + 1;

    for (let i = 0; i < this.items.length; i++) {
      itemsPerPage = itemsPerPage + this.itemsPerPage[i];

      if (itemsPerPage >= newIndex) {
        page = i;

        break;
      }
    }

    return page;
  }

  public goToPage(pageNumber: number, velocity: number): void {
    let itemIndex = 0;

    for (let i = 0; i < pageNumber; i++) {
      itemIndex = itemIndex + this.itemsPerPage[i];
    }

    if (itemIndex + 1 <= this.lastIndexToShow) {
      const lastPageItem = this.items[itemIndex] as HTMLElement;

      this.animate(lastPageItem.offsetLeft, velocity);
      this.updateIndex(itemIndex);
    } else {
      this.animate(this.containerFullWidth(), velocity);
      this.updateIndex(this.lastIndexToShow);
    }

    this.activateBullets();
    this.activateControls();
  }

  public activateBullets(): void {
    if (this.options.showBullets) {
      const bullets = this.bulletsContainer.getElement().children;
      const page = this.options.loop
        ? this.getCurrentPage() - 1
        : this.getCurrentPage();

      DOMUtils.removeClassToItems(bullets, 'active');

      if (bullets[page]) {
        DOMUtils.addClass(bullets[page], 'active');
      }
    }
  }

  public autoplay(): void {
    this.container.removeEventListener(this.supportEvents.out, this.autoplay);

    this.interval = window.setInterval(() => {
      this.showNext();
    }, this.options.autoplayMs);
  }

  public stopAutoplay(): void {
    clearInterval(this.interval);
    this.container.addEventListener(this.supportEvents.out, this.autoplay);
  }

  public createClones(): void {
    const amountFirstPage = this.itemsPerPage[0];
    const amountLastPage = this.itemsPerPage[this.itemsPerPage.length - 1];
    const clons = this.container.querySelectorAll(`.${ Swiper.CLONED_CLASS }`);

    for (let i = 0; i < amountFirstPage; i++) {
      const currentItem = this.items[i] as HTMLElement;
      const clonedItem = currentItem.cloneNode(true) as HTMLElement;

      DOMUtils.addClass(clonedItem, Swiper.CLONED_CLASS);
      this.container.appendChild(clonedItem);
    }

    const lastItem = this.items.length - 1;
    const lastItemToClone = lastItem - amountLastPage;

    for (let i = lastItem; i > lastItemToClone; i--) {
      const currentItem = this.items[i] as HTMLElement;
      const clonedItem = currentItem.cloneNode(true) as HTMLElement;

      DOMUtils.addClass(clonedItem, Swiper.CLONED_CLASS);
      this.container.insertBefore(clonedItem, this.container.firstChild);
    }

    DOMUtils.removeElements(clons);
    this.items = this.container.querySelectorAll(`.${ Swiper.ITEM_CLASS }`);
    this.lastIndexToShow = this.lastToShow();
    this.itemsPerPage = DOMUtils.itemsPerSection(this.items, this.container);
  }
}

export { Swiper, SwiperOptions };
