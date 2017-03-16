import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';
import { Overlay } from './Overlay';

class ResponsiveMenu {
  private static BODY_CLASS: string = 'responsive-menu-body';
  private static MENU_ANIMATE_CLASS: string = 'responsive-menu-animated';
  private static MENU_CLASS: string = 'responsive-menu';
  static readonly EVENT: string = 'click';
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly BUTTON_OUTER_CLASS: string = 'menu-hamburger-btn';
  static readonly BUTTON_INNER_CLASS: string = 'hamburger';

  private menu: HTMLElement;
  private openButton: Element;
  private hamburgerButton: DOMElement;
  private hamburgerButtonContent: DOMElement;
  private hamburgerButtonElement: HTMLElement;
  private openButtonId: string;
  private position: string; // bottom, left, right, top
  private type: string; // discover, over, push
  private showOverlay: boolean;
  private isMainMenu: boolean;
  private buttonType: string; // hamburger-x, hamburger-back

  constructor(menu: HTMLElement) {
    this.menu = menu;
    this.type = this.menu.getAttribute('data-responsive-menu') || 'over';
    this.openButtonId = this.menu.getAttribute('data-menu-open-button-id');
    this.openButton = document.getElementById(this.openButtonId);
    this.position = this.menu.getAttribute('data-menu-position') || 'left';
    this.showOverlay = this.menu.getAttribute('data-menu-overlay') === 'true';
    this.isMainMenu = this.menu.getAttribute('data-is-main') === 'true';
    this.buttonType = 'hamburger-x';
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

    this.renderHamburgerBtn();
    this.update();

    window.onEvent('resize', this.update, 200);
  }

  private renderHamburgerBtn(): void {
    if (this.isMainMenu) {
      this.openButton.innerHTML = null;
      this.hamburgerButton = new DOMElement('div');
      this.hamburgerButton.addClasses([
        ResponsiveMenu.BUTTON_OUTER_CLASS,
        this.position,
        this.type
      ]);
      this.hamburgerButtonElement = this.hamburgerButton.getElement();
      this.hamburgerButton.render(this.openButton);
      this.hamburgerButtonContent = new DOMElement('span');
      this.hamburgerButtonContent.addClasses([
        ResponsiveMenu.BUTTON_INNER_CLASS,
        this.buttonType
      ]);
      this.hamburgerButtonContent.render(this.hamburgerButtonElement);
    }
  }

  private update(): void {
    if (window.isMobile()) {
      this.openButton.addEventListener(ResponsiveMenu.EVENT, this.open);
    } else {
      this.openButton.removeEventListener(ResponsiveMenu.EVENT, this.open);
    }
  }

  private open(event): void {
    event.stopPropagation();
    document.addEventListener(ResponsiveMenu.EVENT, this.close);
    this.openButton.removeEventListener(ResponsiveMenu.EVENT, this.open);

    DOMUtils.addClass(this.menu, ResponsiveMenu.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(this.menu, ResponsiveMenu.ACTIVE_CLASS);
    DOMUtils.addClass(document.body, ResponsiveMenu.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(document.body, ResponsiveMenu.ACTIVE_CLASS);

    if (this.isMainMenu) {
      DOMUtils.addClass(
        this.hamburgerButtonContent.getElement(),
        ResponsiveMenu.ACTIVE_CLASS
      );
    }

    if (this.showOverlay) {
      Overlay.getInstance().show();
    }

    if (this.type === 'push' || this.type === 'discover') {
      switch (this.position) {
        case 'top':
          document.body.style.top = `${ this.menu.offsetHeight }px`;
          break;
        case 'left':
        case 'right':
        default:
          this.menu.style.top = `${ window.scrollY }px`;
          this.scrollHamburger(window.scrollY);
          break;
      }
    }

    if (this.position === 'bottom' && this.type === 'push') {
      document.body.style.top = `-${ this.menu.offsetHeight }px`;
    }
  }

  private scrollHamburger(posY: number = 0): void {
    if (this.isMainMenu) {
      this.hamburgerButtonElement.style.top = `${ posY }px`;
    }
  }

  private close(event): void {
    let isClickInside = this.menu.contains(event.target);

    if (!isClickInside) {
      event.stopPropagation();
      document.removeEventListener(ResponsiveMenu.EVENT, this.close);
      this.openButton.addEventListener(ResponsiveMenu.EVENT, this.open);
      DOMUtils.removeClass(this.menu, ResponsiveMenu.ACTIVE_CLASS);
      DOMUtils.removeClass(document.body, ResponsiveMenu.ACTIVE_CLASS);

      if (this.isMainMenu) {
        DOMUtils.removeClass(
          this.hamburgerButtonContent.getElement(),
          ResponsiveMenu.ACTIVE_CLASS
        );
      }

      if (this.type === 'push' || this.type === 'discover') {
        switch (this.position) {
          case 'top':
            document.body.style.top = '0px';
            break;
          case 'left':
          case 'right':
          default:
            this.scrollHamburger();
            this.menu.style.top = '0px';
            break;
        }
      }
      if (this.position === 'bottom' && this.type === 'push') {
        document.body.style.top = '0px';
      }

      if (this.showOverlay) {
        Overlay.getInstance().hide();
      }
    }
  }
}

export { ResponsiveMenu };
