import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';
import { Overlay } from './Overlay';

/**
 * Menu responsive class.
 *
 * Base class to create any kind of responsive menu.
 *
 * Don't use this class in your application, use one of the implementations
 * instead (discover, over or push).
 *
 * Use it only to create a new type of menu according to your needs.
 */
class MenuResponsive {
  private static BODY_CLASS: string = 'responsive-menu-body';
  private static MENU_ANIMATE_CLASS: string = 'responsive-menu-animated';
  private static MENU_CLASS: string = 'responsive-menu';
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly BUTTON_OUTER_CLASS: string = 'menu-hamburger-btn';
  static readonly BUTTON_INNER_CLASS: string = 'hamburger';
  static readonly EVENT: string = 'click';

  protected isVertical: boolean;
  protected menu: HTMLElement;
  protected position: string; // bottom, left, right, top
  protected type: string; // discover, over, push
  protected isMainMenu: boolean;
  protected hamburgerButtonElement: HTMLElement;
  private openButton: Element;
  private hamburgerButton: DOMElement;
  private hamburgerButtonContent: DOMElement;
  private openButtonId: string;
  private showOverlay: boolean;
  private buttonType: string; // hamburger-x, hamburger-back

  constructor(menu: HTMLElement, type: string) {
    this.menu = menu;
    this.type = type;
    this.openButtonId = this.menu.getAttribute('data-menu-open-button-id');
    this.openButton = document.getElementById(this.openButtonId);
    this.position = this.menu.getAttribute('data-menu-position') || 'left';
    this.showOverlay = this.menu.getAttribute('data-menu-overlay') === 'true';
    this.isMainMenu = this.menu.getAttribute('data-is-main') === 'true';
    this.buttonType = 'hamburger-x';
    this.isVertical = (this.position === 'top' || this.position === 'bottom');
    this.init = this.init.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  private init(): void {
    DOMUtils.addClass(document.body, this.type);
    DOMUtils.addClass(document.body, this.position);
    DOMUtils.addClass(document.body, MenuResponsive.BODY_CLASS);
    DOMUtils.addClass(this.menu, this.type);
    DOMUtils.addClass(this.menu, this.position);
    DOMUtils.addClass(this.menu, MenuResponsive.MENU_CLASS);

    this.renderHamburgerBtn();
    this.update();

    window.onEvent('resize', this.update, 200);
  }

  protected renderHamburgerBtn(): void {
    if (this.isMainMenu) {
      this.openButton.innerHTML = null;
      this.hamburgerButton = new DOMElement('div');
      this.hamburgerButton.addClasses([
        MenuResponsive.BUTTON_OUTER_CLASS,
        this.position,
        this.type
      ]);
      this.hamburgerButtonElement = this.hamburgerButton.getElement();
      this.hamburgerButton.render(this.openButton);
      this.hamburgerButtonContent = new DOMElement('span');
      this.hamburgerButtonContent.addClasses([
        MenuResponsive.BUTTON_INNER_CLASS,
        this.buttonType
      ]);
      this.hamburgerButtonElement = this.hamburgerButton.getElement();
      this.hamburgerButtonContent.render(this.hamburgerButtonElement);
    }
  }

  private update(): void {
    if (window.isMobile()) {
      this.openButton.addEventListener(MenuResponsive.EVENT, this.open);
    } else {
      this.openButton.removeEventListener(MenuResponsive.EVENT, this.open);
    }
  }

  protected open(event): void {
    event.stopPropagation();
    document.addEventListener(MenuResponsive.EVENT, this.close);
    this.openButton.removeEventListener(MenuResponsive.EVENT, this.open);

    DOMUtils.addClass(this.menu, MenuResponsive.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(this.menu, MenuResponsive.ACTIVE_CLASS);
    DOMUtils.addClass(document.body, MenuResponsive.MENU_ANIMATE_CLASS);
    DOMUtils.addClass(document.body, MenuResponsive.ACTIVE_CLASS);

    if (this.isMainMenu) {
      DOMUtils.addClass(
        this.hamburgerButtonContent.getElement(),
        MenuResponsive.ACTIVE_CLASS
      );
    }

    if (this.showOverlay) {
      Overlay.getInstance().show();
    }
  }

  protected scrollHamburger(posY : number = 0): void {
    if (this.isMainMenu) {
      this.hamburgerButtonElement.style.top = `${ posY }px`;
    }
  }

  protected close(event): void {
    const isClickInside = this.menu.contains(event.target);

    if (!isClickInside) {
      event.stopPropagation();
      document.removeEventListener(MenuResponsive.EVENT, this.close);
      this.openButton.addEventListener(MenuResponsive.EVENT, this.open);
      DOMUtils.removeClass(this.menu, MenuResponsive.ACTIVE_CLASS);
      DOMUtils.removeClass(document.body, MenuResponsive.ACTIVE_CLASS);

      if (this.isMainMenu) {
        DOMUtils.removeClass(
          this.hamburgerButtonContent.getElement(),
          MenuResponsive.ACTIVE_CLASS
        );
      }

      if (this.showOverlay) {
        Overlay.getInstance().hide();
      }
    }
  }
}

export { MenuResponsive };
