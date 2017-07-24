import { DOMElement } from './DOMElement';
import { DOMUtils } from './DOMUtils';

class Overlay {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly STYLE_CLASS: string = 'overlay';
  static readonly TYPE_HTML_ELEMENT: string = 'div';

  public static instance: Overlay = new Overlay();
  public static overlay: DOMElement;

  constructor() {
    if (Overlay.instance) {
      throw new Error('Error: Use Overlay.getInstance() instead of new.');
    }

    Overlay.overlay = new DOMElement(Overlay.TYPE_HTML_ELEMENT);
    DOMUtils.addClass(Overlay.overlay.getElement(), Overlay.STYLE_CLASS);
    Overlay.overlay.render(document.body);
  }

  public static getInstance(): Overlay {
    return Overlay.instance;
  }

  public hide(): void {
    DOMUtils.removeClass(Overlay.overlay.getElement(), Overlay.ACTIVE_CLASS);
  }

  public show(): void {
    DOMUtils.addClass(Overlay.overlay.getElement(), Overlay.ACTIVE_CLASS);
  }

  public getOverlay(): DOMElement {
    return Overlay.overlay;
  }
}

export { Overlay };
