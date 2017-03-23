class MobileCollapser {
  private static COLLAPSER_CLASS: string = 'collapser';
  private static COLLAPSABLE_CLASS: string = 'collapsable';
  private static EVENT: string = 'collapsable';

  private menu: HTMLElement;
  private collapsableMenu: HTMLElement;
  private collapsableId: string;
  private collapsableContainerId: string;

  constructor (menu: HTMLElement) {
    this.menu = menu;
    this.collapsableId = this.menu.getAttribute('data-collapsable');
    this.collapsableMenu = document.getElementById(this.collapsableId);
  }
}

export { MobileCollapser };