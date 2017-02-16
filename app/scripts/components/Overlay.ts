import { DOMElement } from './DOMElement';

class Overlay {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly STYLE_CLASS: string = 'overlay';
  static readonly TYPE_HTML_ELEMENT: string = 'div';

  private static instance: Overlay = new Overlay();
  private static overlay: DOMElement;

  constructor() {
    if (Overlay.instance) {
      throw new Error('Error: Use Overlay.getInstance() instead of new.');
    }

    Overlay.overlay = new DOMElement(Overlay.TYPE_HTML_ELEMENT);
    Overlay.overlay.addClasses([Overlay.STYLE_CLASS]);
    Overlay.overlay.render(document.body);
  }

  public static getInstance(): Overlay {
    return Overlay.instance;
  }

  public hide(): void {
    Overlay.overlay.removeClasses([Overlay.ACTIVE_CLASS]);
  }

  public show(): void {
    Overlay.overlay.addClasses([Overlay.ACTIVE_CLASS]);
  }

  public getOverlay(): DOMElement {
    return Overlay.overlay;
  }
}

export { Overlay };
