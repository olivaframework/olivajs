import { DOMElement } from './DOMElement';

class Overlay {
  static readonly STYLE_ACTIVE_CLASS = 'active';
  static readonly STYLE_CLASS = 'overlay';

  private static instance = new Overlay();
  private static overlay: DOMElement;

  constructor() {
    if (Overlay.instance) {
      throw new Error('Error: Use Overlay.getInstance() instead of new.');
    }

    Overlay.overlay = new DOMElement('div');
    Overlay.overlay.addClasses([Overlay.STYLE_CLASS]);
    Overlay.overlay.render(document.body);
  }

  public static getInstance(): Overlay {
    return Overlay.instance;
  }

  public hide(): void {
    Overlay.overlay.removeClasses([Overlay.STYLE_ACTIVE_CLASS]);
  }

  public show(): void {
    Overlay.overlay.addClasses([Overlay.STYLE_ACTIVE_CLASS]);
  }
}

export { Overlay };
