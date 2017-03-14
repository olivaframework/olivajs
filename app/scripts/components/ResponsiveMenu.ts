import { Overlay } from './Overlay';

class ResponsiveMenu {
  private static BODY_CLASS: string = 'responsive-menu-body';
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
    document.body.classList.add(ResponsiveMenu.BODY_CLASS);
    document.body.classList.add(this.type);
    document.body.classList.add(this.position);
    this.menu.classList.add(ResponsiveMenu.MENU_CLASS);
    this.menu.classList.add(this.position);
    this.menu.classList.add(this.type);

    window.onEvent('resize', this.update, 200);
    this.update();
  }

  private update(): void {
    if (window.isMobile()) {
      this.openButton.addEventListener(
        ResponsiveMenu.EVENT_ACTIVE,
        this.open
      );
    } else {
      this.openButton.removeEventListener(
        ResponsiveMenu.EVENT_ACTIVE,
        this.open
      );
    }
  }

  private open(): void {
    this.menu.classList.add(ResponsiveMenu.ACTIVE_CLASS);
    document.body.classList.add(ResponsiveMenu.ACTIVE_CLASS);

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
      this.menu.classList.remove(ResponsiveMenu.ACTIVE_CLASS);
      document.body.classList.remove(ResponsiveMenu.ACTIVE_CLASS);

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
