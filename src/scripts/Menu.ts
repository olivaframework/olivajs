import { DOMUtils } from './DOMUtils';
import { WindowUtils } from './WindowUtils';

interface MenuOptions {
  keepOpenedSubmenu: boolean;
}

class Menu {
  static readonly ACTIVE_EVENT = 'click';
  static readonly BODY_MENU_CLASS = 'body-menu';
  static readonly BODY_MENU_OPEN_CLASS = 'menu-open';
  static readonly MENU_CONTAINER_CLASS = 'menu-container';
  static readonly MENU_ACTIVE_CLASS = 'active';
  static readonly MENU_ITEM_CLASS = 'menu-item';
  static readonly SUBMENU_CONTAINER_CLASS = 'submenu-container';
  static readonly SUBMENU_ACTIVE_CLASS = 'active';
  static readonly SUBMENU_CLOSE_ATTR = 'data-submenu-close';
  static readonly MENU_OPEN_ATTR = 'data-menu-open';
  static readonly MENU_OPEN_ACTIVE_CLASS = 'active';

  private buttonOpen: HTMLElement;
  private menu: HTMLElement;
  private menuContainer: HTMLElement;
  private submenus: NodeListOf<Element>;
  private items: NodeListOf<Element>;
  private openedSubmenu: HTMLElement;
  private options: MenuOptions;

  constructor(menu: HTMLElement, options: MenuOptions) {
    this.menu = menu;
    this.options = options;
    this.openMenu = this.openMenu.bind(this);
    this.openSubMenu = this.openSubMenu.bind(this);
    this.items = menu.querySelectorAll(`.${ Menu.MENU_ITEM_CLASS }`);
    this.submenus = menu.querySelectorAll(`.${ Menu.SUBMENU_CONTAINER_CLASS }`);
    this.menuContainer = menu.querySelector(
      `.${ Menu.MENU_CONTAINER_CLASS }`
    ) as HTMLElement;
    this.buttonOpen = menu.querySelector(
      `[${ Menu.MENU_OPEN_ATTR }]`
    ) as HTMLElement;

    this.buttonOpen.addEventListener(Menu.ACTIVE_EVENT, this.openMenu);

    if (this.options.keepOpenedSubmenu) {
      for (let i = 0; i < this.submenus.length; i++) {
        const containClass = DOMUtils.containsClass(
          this.submenus[i], Menu.SUBMENU_ACTIVE_CLASS
        );

        if (containClass) {
          this.openedSubmenu = this.submenus[i] as HTMLElement;

          break;
        }
      }
    }

    this.addEventListeners();
    DOMUtils.addClass(document.body, Menu.BODY_MENU_CLASS);
  }

  private addEventListeners(): void {
    const closeElements = this.menuContainer.querySelectorAll(
      `[${ Menu.SUBMENU_CLOSE_ATTR }]`
    );

    DOMUtils.syncForEach(item => {
      item.addEventListener(Menu.ACTIVE_EVENT, this.closeSubMenus);
    }, closeElements);

    DOMUtils.syncForEach(item => {
      item.addEventListener(Menu.ACTIVE_EVENT, this.openSubMenu);
    }, this.items);
  }

  private openMenu(event): void {
    event.stopPropagation();

    DOMUtils.removeClassToItems(this.submenus, Menu.SUBMENU_ACTIVE_CLASS);
    DOMUtils.toggleClass(this.menuContainer, Menu.MENU_ACTIVE_CLASS);
    DOMUtils.toggleClass(document.body, Menu.BODY_MENU_OPEN_CLASS);
    DOMUtils.toggleClass(this.buttonOpen, Menu.MENU_OPEN_ACTIVE_CLASS);

    if (this.openedSubmenu) {
      DOMUtils.addClass(this.openedSubmenu, Menu.SUBMENU_ACTIVE_CLASS);
    }
  }

  private openSubMenu(event): void {
    const handler = event.target;

    if ((DOMUtils.containsClass(handler, Menu.MENU_ITEM_CLASS)
      || DOMUtils.containsClass(handler.parentNode, Menu.MENU_ITEM_CLASS))
      && WindowUtils.isMobile()) {
      event.preventDefault();

      const item = DOMUtils.findParentElementByClass(
        handler, Menu.MENU_ITEM_CLASS
      );
      const submenu = item.querySelector(`.${ Menu.SUBMENU_CONTAINER_CLASS }`);

      DOMUtils.addClass(submenu, Menu.SUBMENU_ACTIVE_CLASS);
    }
  }

  private closeSubMenus(event): void {
    event.stopPropagation();

    const handler = event.target;
    const submenuContainer = DOMUtils.findParentElementByClass(
      handler, Menu.SUBMENU_CONTAINER_CLASS
    );

    DOMUtils.removeClass(submenuContainer, Menu.SUBMENU_ACTIVE_CLASS);
  }
}

export { Menu };
