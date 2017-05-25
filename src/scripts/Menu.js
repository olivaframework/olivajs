"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Window");
var DOMUtils_1 = require("./DOMUtils");
var Menu = (function () {
    function Menu(menu) {
        this.menu = menu;
        this.openMenu = this.openMenu.bind(this);
        this.openSubMenu = this.openSubMenu.bind(this);
        this.items = menu.querySelectorAll("." + Menu.MENU_ITEM_CLASS);
        this.submenus = menu.querySelectorAll("." + Menu.SUBMENU_CONTAINER_CLASS);
        this.menuContainer = menu.querySelector("." + Menu.MENU_CONTAINER_CLASS);
        this.buttonOpen = menu.querySelector("[" + Menu.MENU_OPEN_ATTR + "]");
        this.buttonOpen.addEventListener(Menu.ACTIVE_EVENT, this.openMenu);
        this.addEventListeners();
        DOMUtils_1.DOMUtils.addClass(document.body, Menu.BODY_MENU_CLASS);
        if (window.isMobile()) {
            DOMUtils_1.DOMUtils.removeClassToItems(this.submenus, Menu.SUBMENU_ACTIVE_CLASS);
        }
    }
    Menu.prototype.addEventListeners = function () {
        var _this = this;
        var closeElements = this.menuContainer
            .querySelectorAll("[" + Menu.SUBMENU_CLOSE_ATTR + "]");
        DOMUtils_1.DOMUtils.syncForEach(function (item) {
            item.addEventListener(Menu.ACTIVE_EVENT, _this.closeSubMenus);
        }, closeElements);
        DOMUtils_1.DOMUtils.syncForEach(function (item) {
            item.addEventListener(Menu.ACTIVE_EVENT, _this.openSubMenu);
        }, this.items);
    };
    Menu.prototype.openMenu = function () {
        event.stopPropagation();
        DOMUtils_1.DOMUtils.toggleClass(this.menuContainer, Menu.MENU_ACTIVE_CLASS);
        DOMUtils_1.DOMUtils.toggleClass(document.body, Menu.BODY_MENU_OPEN_CLASS);
        DOMUtils_1.DOMUtils.removeClassToItems(this.submenus, Menu.SUBMENU_ACTIVE_CLASS);
        DOMUtils_1.DOMUtils.toggleClass(this.buttonOpen, Menu.MENU_OPEN_ACTIVE_CLASS);
    };
    Menu.prototype.openSubMenu = function (event) {
        var handler = event.target;
        if ((DOMUtils_1.DOMUtils.containsClass(handler, Menu.MENU_ITEM_CLASS)
            || DOMUtils_1.DOMUtils.containsClass(handler.parentNode, Menu.MENU_ITEM_CLASS))
            && window.isMobile()) {
            event.preventDefault();
            var item = DOMUtils_1.DOMUtils
                .findParentElementByClass(handler, Menu.MENU_ITEM_CLASS);
            var submenu = item.querySelector("." + Menu.SUBMENU_CONTAINER_CLASS);
            DOMUtils_1.DOMUtils.addClass(submenu, Menu.SUBMENU_ACTIVE_CLASS);
        }
    };
    Menu.prototype.closeSubMenus = function (event) {
        event.stopPropagation();
        var handler = event.target;
        var submenuContainer = DOMUtils_1.DOMUtils.findParentElementByClass(handler, Menu.SUBMENU_CONTAINER_CLASS);
        DOMUtils_1.DOMUtils.removeClass(submenuContainer, Menu.SUBMENU_ACTIVE_CLASS);
    };
    return Menu;
}());
Menu.ACTIVE_EVENT = 'click';
Menu.BODY_MENU_CLASS = 'body-menu';
Menu.BODY_MENU_OPEN_CLASS = 'menu-open';
Menu.MENU_CONTAINER_CLASS = 'menu-container';
Menu.MENU_ACTIVE_CLASS = 'active';
Menu.MENU_ITEM_CLASS = 'menu-item';
Menu.SUBMENU_CONTAINER_CLASS = 'submenu-container';
Menu.SUBMENU_ACTIVE_CLASS = 'active';
Menu.SUBMENU_CLOSE_ATTR = 'data-submenu-close';
Menu.MENU_OPEN_ATTR = 'data-menu-open';
Menu.MENU_OPEN_ACTIVE_CLASS = 'active';
exports.Menu = Menu;
//# sourceMappingURL=Menu.js.map