import { MenuResponsive } from './MenuResponsive';

/**
 * Menu discover
 *
 * Converts any DOMElement in a mobile menu when the viewport width matches
 * the window.isMobile() condition (default: 768px).
 *
 * Behaviour:
 * Pushes the body to the direction selected and reveals the menu
 * in the background.
 *
 * Note: Menu discover position bottom has no sense since the menu can't be
 * discovered if there is remaining body below to be scrolled. (However
 * you can try it)
 */
class MenuDiscover extends MenuResponsive {
  protected type;

  constructor(menu: HTMLElement) {
    super(menu, 'discover');
  }

  protected open(event): void {
    super.open(event);
    if (this.isVertical) {
      document.body.style[this.position] = `${ this.menu.offsetHeight }px`;
      this.hamburgerButtonElement.style[this.position]
        = `${ this.menu.offsetHeight }px`;
    } else {
      this.hamburgerButtonElement.style[this.position]
        = `${ this.menu.offsetWidth }px`;
    }
  }

  protected close(event): void {
    super.close(event);
    if (this.isVertical) {
      document.body.style[this.position] = '0';
    }
    this.hamburgerButtonElement.style[this.position] = '0';
  }
}

export { MenuDiscover };
