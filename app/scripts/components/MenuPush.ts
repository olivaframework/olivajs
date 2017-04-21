import * as MenuResponsive from './MenuResponsive';

/**
 * Menu Push
 *
 * Converts any DOMElement in a mobile menu when the viewport width matches
 * the window.isMobile() condition (default: 768px).
 *
 * Behaviour:
 * The menu comes from the desired edge of the screen and pushes the body to
 * fit the screen.
 *
 * Note: Menu push position bottom has no sense since the menu can't
 * push the body up if there is remaining body below to be scrolled.
 * (However you can try it)
 */
class MenuPush extends MenuResponsive.MenuResponsive {
  protected type;

  constructor(menu: HTMLElement, config: MenuResponsive.MenuConfig) {
    config.type = 'push';
    super(menu, config);
  }

  protected open(event): void {
    super.open(event);
    if (this.position === 'top') {
      document.body.style.top = `${ this.menu.offsetHeight }px`;
    } else if (this.position === 'bottom') {
      document.body.style.top = `-${ this.menu.offsetHeight }px`;
    } else {
      this.menu.style.top = `${ window.scrollY }px`;
      super.scrollHamburger(window.scrollY);
    }
  }

  protected close(event): void {
    super.close(event);
    if (this.position === 'top') {
      document.body.style.top = '0px';
    } else if (this.position === 'bottom') {
      document.body.style.top = '0px';
    } else {
      this.scrollHamburger();
      this.menu.style.top = '0px';
    }
  }
}

export { MenuPush };
