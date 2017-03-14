import { DOMUtils } from './DOMUtils';
import { Overlay } from './Overlay';

class ResponsiveMenu {
  private static BODY_CLASS: string = 'responsive-menu-body';
  private static MENU_ANIMATE_CLASS: string = 'responsive-menu-animated';
  private static MENU_CLASS: string = 'responsive-menu';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly ACTIVE_CLASS: string = 'active';

  private menu: HTMLElement;
  private openButton: Element;
  private openButtonId: string;
  private position: string; // bottom, left, right, top
  private type: string; // discover, over, push
  private showOverlay: boolean;

  constructor(menu: HTMLElement) {
    this.menu = menu;
    this.type = this.menu.getAttribute('data-responsive-menu') || 'over';
    this.openButtonId = this.menu.getAttribute('data-menu-open-button-id');
    this.openButton = document.getElementById(this.openButtonId);
    this.position = this.menu.getAttribute('data-menu-position') || 'left';
    this.showOverlay = this.menu.getAttribute('data-menu-overlay') === 'true';
    this.init = this.init.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  private init(): void {
    DOMUtils.addClass(document.body, this.type);
    DOMUtils.addClass(document.body, this.position);
    DOMUtils.addClass(document.body, ResponsiveMenu.BODY_CLASS);
    DOMUtils.addClass(this.menu, this.type);
    DOMUtils.addClass(this.menu, this.position);
    DOMUtils.addClass(this.menu, ResponsiveMenu.MENU_CLASS);

    window.onEvent('resize', this.update, 200);
    this.update();
  }

  private update(): void {
    if (window.isMobile()) {
      this.openButton.addEventListener(ResponsiveMenu.EVENT_ACTIVE, this.open);
    } else {
      this.openButton.addEventListener(ResponsiveMenu.EVENT_ACTIVE, this.open);
    }
  }

  private open(): void {
    DOMUtils.addClass(this.menu, ResponsiveMenu.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(this.menu, ResponsiveMenu.ACTIVE_CLASS);
    DOMUtils.addClass(document.body, ResponsiveMenu.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(document.body, ResponsiveMenu.ACTIVE_CLASS);

    if (this.showOverlay) {
      Overlay.getInstance().show();
    }

    if ((this.type === 'push' || this.type === 'discover')
      && this.position === 'top') {
      document.body.style.top = `${ this.menu.offsetHeight }px`;
    }

    if (this.position === 'bottom' && this.type === 'push') {
      document.body.style.top = `-${ this.menu.offsetHeight }px`;
    }

    window.addEventListener(ResponsiveMenu.EVENT_ACTIVE, this.close);
  }

  private close(event): void {
    let isClickInside = this.menu.contains(event.target)
      || this.openButton.contains(event.target);

    if (!isClickInside) {
      DOMUtils.removeClass(this.menu, ResponsiveMenu.ACTIVE_CLASS);
      DOMUtils.removeClass(document.body, ResponsiveMenu.ACTIVE_CLASS);

      if ((this.type === 'push' || this.type === 'discover')
        && this.position === 'top') {
        document.body.style.top = '0px';
      }
      if (this.position === 'bottom' && this.type === 'push') {
        document.body.style.top = '0px';
      }

      if (this.showOverlay) {
        Overlay.getInstance().hide();
      }

      window.removeEventListener(ResponsiveMenu.EVENT_ACTIVE, this.close);
    }
  }
}

export { ResponsiveMenu };
