import { DOMUtils } from './DOMUtils';
import { Overlay } from './Overlay';

class Modal {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly ATTR: string = 'data-modal-content-id';
  static readonly ATTR_CLOSE: string = 'data-modal-close';
  static readonly ATTR_CLOSE_ON_OVERLAY: string = 'data-close-on-overlay';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly EVENT_CLOSE: string = 'click';

  public handler: Element;
  public modal: Element;
  public overlay: Overlay;

  constructor(handler: Element) {
    this.handler = handler;
    this.overlay = Overlay.getInstance();
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.modal = document.getElementById(handler.getAttribute(Modal.ATTR));
    this.handler.addEventListener(Modal.EVENT_ACTIVE, this.show);

    this.setFunctionClose();
  }

  public setFunctionClose(): void {
    const closeElements = this.modal
      .querySelectorAll(`[${ Modal.ATTR_CLOSE }]`);

    DOMUtils.syncForEach(item => {
      item.addEventListener(Modal.EVENT_CLOSE, this.hide);
    }, closeElements);

    if (this.modal.getAttribute(Modal.ATTR_CLOSE_ON_OVERLAY) !== 'false') {
      const overlay = this.overlay.getOverlay().getElement();

      overlay.addEventListener(Modal.EVENT_CLOSE, this.hide);
    }
  }

  public show(event: Event): void {
    event.preventDefault();
    DOMUtils.addClass(this.modal, Modal.ACTIVE_CLASS);
    this.overlay.show();
  }

  public hide(): void {
    DOMUtils.removeClass(this.modal, Modal.ACTIVE_CLASS);
    this.overlay.hide();
  }
}

export { Modal };
