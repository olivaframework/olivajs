import { DOMUtils } from './DOMUtils';

interface CollapserEvents {
  click: string;
  inside: string;
  outside: string;
}

class MenuCollapser {
  private static COLLAPSER_CLASS: string = 'collapser';
  private static COLLAPSABLE_CLASS: string = 'collapsable';
  private static ACTIVE_CLASS: string = 'active';
  private static readonly TOUCH_EVENTS: CollapserEvents = {
    click: 'touchend',
    inside: 'touchend',
    outside: 'touchend'
  };
  private static readonly MOUSE_EVENTS: CollapserEvents = {
    click: 'mouseover',
    inside: 'mouseenter',
    outside: 'mouseleave'
  };

  private menu: HTMLElement;
  private isOpen: boolean;
  private collapsableId: string;
  private collapsableMenu: HTMLElement;
  private defaultActive: boolean;
  private events: CollapserEvents;
  private openIntent: number;

  constructor(menu: HTMLElement) {
    this.menu = menu;
    this.collapsableId = this.menu.getAttribute('data-menu-collapser');
    this.collapsableMenu = document.getElementById(this.collapsableId);
    this.defaultActive = this.menu.getAttribute('default-active') === 'true';
    this.init = this.init.bind(this);
    this.open = this.open.bind(this);
    this.openAttempt = this.openAttempt.bind(this);
    this.cancelOpenIntent = this.cancelOpenIntent.bind(this);
    this.close = this.close.bind(this);
    this.closeAttempt = this.closeAttempt.bind(this);
    this.update = this.update.bind(this);
    this.updateDefaultActive = this.updateDefaultActive.bind(this);
    this.init();
  }

  private init() {
    DOMUtils.addClass(this.menu, MenuCollapser.COLLAPSER_CLASS);
    DOMUtils.addClass(this.collapsableMenu, MenuCollapser.COLLAPSABLE_CLASS);

    this.update();
    this.updateDefaultActive();
    window.onEvent('resize', this.update, 200);

    if (this.defaultActive) {
      window.onEvent('resize', this.updateDefaultActive, 200);
    }
  }

  private update() {
    this.events = window.supportTouchEvents()
      ? MenuCollapser.TOUCH_EVENTS
      : MenuCollapser.MOUSE_EVENTS;

    if (window.isMobile() && this.defaultActive) {
      this.isOpen = true;
      DOMUtils.addClass(this.collapsableMenu, MenuCollapser.ACTIVE_CLASS);
      this.menu.addEventListener(this.events.inside, this.closeAttempt);
    } else {
      this.menu.addEventListener(this.events.inside, this.openAttempt);
    }

    if (!window.isMobile() && this.defaultActive) {
      this.isOpen = null;
      DOMUtils.removeClass(this.collapsableMenu, MenuCollapser.ACTIVE_CLASS);
    }
  }

  private updateDefaultActive() {
    if (this.defaultActive) {
      DOMUtils.addClass(this.collapsableMenu, MenuCollapser.ACTIVE_CLASS);
      this.isOpen = true;
    }
  }

  private open() {
    DOMUtils.addClass(this.collapsableMenu, MenuCollapser.ACTIVE_CLASS);
    this.menu.removeEventListener(this.events.inside, this.openAttempt);
    if (window.isMobile() || window.supportTouchEvents()) {
      document.body.addEventListener(this.events.outside, this.closeAttempt);
    } else {
      this.menu.addEventListener(this.events.outside, this.closeAttempt);
      this.collapsableMenu.addEventListener(this.events.outside,
        this.closeAttempt);
    }
    this.isOpen = true;
  }

  private openAttempt() {
    const timer = window.isMobile() || window.supportTouchEvents() ? 0 : 120;

    this.openIntent = setTimeout(this.open, timer);
    this.menu.addEventListener(this.events.outside, this.cancelOpenIntent);
  }

  private cancelOpenIntent() {
    clearTimeout(this.openIntent);
    this.menu.removeEventListener(this.events.outside, this.cancelOpenIntent);
  }

  private close() {
    event.stopPropagation();
    DOMUtils.removeClass(this.collapsableMenu, MenuCollapser.ACTIVE_CLASS);
    this.menu.addEventListener(this.events.inside, this.openAttempt);
    this.menu.removeEventListener(this.events.outside, this.closeAttempt);
    this.collapsableMenu.removeEventListener(this.events.outside,
      this.closeAttempt);
    this.isOpen = false;
  }

  private closeAttempt(event): void {
    let isInside = this.collapsableMenu.contains(event.relatedTarget);

    if (window.isMobile()) {
      isInside = this.collapsableMenu.contains(event.target);
    }

    if (!window.isMobile() && window.supportTouchEvents()) {
      isInside = this.collapsableMenu.contains(event.target)
        || this.collapsableMenu.contains(event.target);
    }

    if (!isInside) {
      this.close();
    }
  }
}

export { MenuCollapser };
