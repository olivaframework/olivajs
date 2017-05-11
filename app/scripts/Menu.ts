import './Window';
import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';

class Menu {
  static readonly ACTIVE_EVENT = 'click';
  static readonly MENU_CONTAINER_CLASS = 'mainmenu-container';
  static readonly MENU_ACTIVE_CLASS = 'active';
  static readonly SUBMENU_CONTAINER_CLASS = 'submenu-container';
  static readonly SUBMENU_CLOSE_ATTR = 'data-submenu-close';
  static readonly SUBMENU_CLASS = 'submenu';
  static readonly SUBMENU_ATTR = 'data-submenu-id';
  static readonly SUBMENU_ACTIVE_CLASS = 'active';
  static readonly BODY_MENU_CLASS = 'body-menu';
  static readonly BODY_MENU_OPEN_CLASS = 'menu-open';

  public button: DOMElement;
  public menu: HTMLElement;
  public mainMenu: HTMLElement;
  public submenu: HTMLElement;
  public submenus: NodeListOf<Element>;
  public items: NodeListOf<Element>;

  constructor(menu) {
    this.menu = menu;
    this.update = this.update.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.openSubMenu = this.openSubMenu.bind(this);
    this.closeSubMenus = this.closeSubMenus.bind(this);
    this.mainMenu = menu.querySelector(`.${ Menu.MENU_CONTAINER_CLASS }`);
    this.items = menu.querySelectorAll('li');
    this.submenu = menu.querySelector(`.${ Menu.SUBMENU_CONTAINER_CLASS }`);
    this.submenus = menu.querySelectorAll(`.${ Menu.SUBMENU_CLASS }`);
    this.button = new DOMElement('div');
    this.setFunctionCloseSubmenu();
    this.update();

    DOMUtils.addClass(document.body, Menu.BODY_MENU_CLASS);
    window.onEvent('resize', this.update, 100);
  }

  public setFunctionCloseSubmenu(): void {
    const closeElements = this.menu
      .querySelectorAll(`[${ Menu.SUBMENU_CLOSE_ATTR }]`);

    DOMUtils.syncForEach(item => {
      item.addEventListener(Menu.ACTIVE_EVENT, this.closeSubMenus);
    }, closeElements);
  }

  public closeSubMenus(): void {
    DOMUtils.removeClass(this.submenu, Menu.SUBMENU_ACTIVE_CLASS);

    setTimeout(() => {
      DOMUtils.removeClassToItems(this.submenus, Menu.SUBMENU_ACTIVE_CLASS);
    }, 300);
  }

  public createMenuButton(): void {
    this.button = new DOMElement('div');
    this.button.addClasses(['menu-hamburger-btn']);
    this.button.setContent('<span class="hamburger-btn"></span>');
    this.button.render(this.menu.parentNode);
    this.button.addEvents([{
      callback: this.openMenu,
      name: Menu.ACTIVE_EVENT
    }]);
  }

  public openMenu(): void {
    event.stopPropagation();
    DOMUtils.toggleClass(this.menu, Menu.MENU_ACTIVE_CLASS);
    DOMUtils.toggleClass(document.body, Menu.BODY_MENU_OPEN_CLASS);

    if (window.isMobile()) {
      this.button.toggleClasses(['active']);
    }
  }

  public openSubMenu(event): void {
    const handler = event.target;
    const subMenuId = handler.getAttribute(Menu.SUBMENU_ATTR);
    const submenu = this.submenu.querySelector(`#${ subMenuId }`);

    if (submenu) {
      event.preventDefault();
      DOMUtils.addClass(this.submenu, Menu.SUBMENU_ACTIVE_CLASS);
      DOMUtils.addClass(submenu, Menu.SUBMENU_ACTIVE_CLASS);
    }
  }

  public closeSubmenus(): void {
    DOMUtils.removeClassToItems(this.submenus, Menu.SUBMENU_ACTIVE_CLASS);
    DOMUtils.removeClass(this.mainMenu, Menu.MENU_ACTIVE_CLASS);
    DOMUtils.removeClass(document.body, Menu.BODY_MENU_OPEN_CLASS);
    DOMUtils.removeClass(this.submenu, Menu.MENU_ACTIVE_CLASS);
  }

  public update(): void {
    this.button.destroy();

    if (window.isMobile()) {
      this.closeSubmenus();
      this.createMenuButton();

      for (let i = 0; i < this.items.length; i++) {
        this.items[i].addEventListener(Menu.ACTIVE_EVENT, this.openSubMenu);
      }
    } else {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]
          .removeEventListener(Menu.ACTIVE_EVENT, this.openSubMenu);
      }
    }
  }
}

export { Menu };
