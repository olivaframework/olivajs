import { DOMElement } from './DOMElement';
import { Overlay } from './Overlay';

class Loader {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly LOADER_CLASS: string = 'loader';
  static readonly LOADER_ELEMENT: string = 'div';
  static readonly LOADER_ICON_ELEMENT: string = 'div';
  static readonly LOADER_ICON_CLASSES: string[] = [
    'fa', 'fa-spinner', 'fa-pulse', 'fa-3x', 'fa-fw'
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

    Loader.loader = new DOMElement(Loader.LOADER_ELEMENT);
    Loader.loader.addClasses([Loader.LOADER_CLASS]);
    Loader.loader.render(document.body);

    Loader.loaderIcon = new DOMElement(Loader.LOADER_ICON_ELEMENT);
    Loader.loaderIcon.addClasses(Loader.LOADER_ICON_CLASSES);
    Loader.loaderIcon.render(Loader.loader.getElement());
  }

  public static getInstance(): Loader {
    return Loader.instance;
  }

  public show(): void {
    Loader.loader.addClasses([Loader.ACTIVE_CLASS]);
    this.overlay.show();
  }

  public hide(): void {
    Loader.loader.removeClasses([Loader.ACTIVE_CLASS]);
    this.overlay.hide();
  }
}

export { Loader };
