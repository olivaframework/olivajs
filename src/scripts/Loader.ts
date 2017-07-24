import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';
import { Overlay } from './Overlay';

class Loader {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly STYLE_CLASS: string = 'loader';
  static readonly TYPE_HTML_ELEMENT: string = 'div';
  static readonly ICON_ELEMENT: string = 'div';
  static readonly ICON_CLASSES: string[] = [
    'fa', 'fa-spinner', 'fa-pulse', 'fa-fw'
  ];

  private static instance: Loader = new Loader();
  private static loader: DOMElement;
  private static loaderIcon: DOMElement;
  private overlay: Overlay;

  constructor() {
    if (Loader.instance) {
      throw new Error('Error: Use Loader.getInstance() instead of new.');
    }

    this.overlay = Overlay.getInstance();

    Loader.loader = new DOMElement(Loader.TYPE_HTML_ELEMENT);
    DOMUtils.addClass(Loader.loader.getElement(), Loader.STYLE_CLASS);
    Loader.loader.render(document.body);

    Loader.loaderIcon = new DOMElement(Loader.ICON_ELEMENT);
    DOMUtils.addClasses(Loader.loader.getElement(), Loader.ICON_CLASSES);
    Loader.loaderIcon.render(Loader.loader.getElement());
  }

  private static getInstance(): Loader {
    return Loader.instance;
  }

  private show(): void {
    DOMUtils.addClass(Loader.loader.getElement(), Loader.ACTIVE_CLASS);
    this.overlay.show();
  }

  private hide(): void {
    Loader.loader.removeClasses([Loader.ACTIVE_CLASS]);
    this.overlay.hide();
  }

  private getLoader(): DOMElement {
    return Loader.loader;
  }
}

export { Loader };
