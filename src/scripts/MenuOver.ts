import { MenuResponsive } from './MenuResponsive';

/**
 * Menu Over
 *
 * Converts any DOMElement in a mobile menu when the viewport width matches
 * the WindowUtils.isMobile() condition (default: 768px).
 *
 * Behaviour:
 * The menu comes from the desired edge of the screen and places itself
 * floating over the body.
 */
class MenuOver extends MenuResponsive {
  protected type;

  constructor(menu: HTMLElement) {
    super(menu, 'over');
  }

  protected open(event): void {
    super.open(event);
    if (this.isMainMenu && this.isVertical) {
      this.hamburgerButtonElement.style[this.position]
        = `${ this.menu.offsetHeight }px`;
    }

    if (this.isMainMenu && !this.isVertical) {
      this.hamburgerButtonElement.style[this.position]
        = `${ this.menu.offsetWidth }px`;
    }
  }

  protected close(event): void {
    super.close(event);
    if (this.isMainMenu) {
      this.hamburgerButtonElement.style[this.position] = '0px';
    }
  }
}

export { MenuOver };
