import { Overlay } from './Overlay';

class Modal {
  static readonly ACTIVE_CLASS: string = 'active';
  static readonly ATTR: string = 'data-modal-content-id';
  static readonly ATTR_CLOSE: string = 'data-modal-close';
  static readonly ATTR_CLOSE_ON_OVERLAY: string = 'data-close-on-overlay';
  static readonly EVENT_ACTIVE: string = 'click';
  static readonly EVENT_CLOSE: string = 'click';

  private handler: Element;
  private modal: Element;
  private closeElements: NodeListOf<Element>;
  private overlay: Overlay;
  private closeOnOverlay: boolean = true;

  constructor(handler: Element) {
    this.handler = handler;
    this.overlay = Overlay.getInstance();
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.modal = document.getElementById(handler.getAttribute(Modal.ATTR));
    this.handler.addEventListener(Modal.EVENT_ACTIVE, this.show);
    this.closeElements = this.modal.querySelectorAll(`[${ Modal.ATTR_CLOSE }]`);

    for (let i = 0; i < this.closeElements.length; i++) {
      this.closeElements[i].addEventListener(Modal.EVENT_CLOSE, this.hide);
    }

    if (this.modal.getAttribute(Modal.ATTR_CLOSE_ON_OVERLAY) === 'false') {
      this.closeOnOverlay = false;
    }
  }

  public show(): void {
    this.modal.classList.add(Modal.ACTIVE_CLASS);
    this.overlay.show();

    if (this.closeOnOverlay) {
      this.overlay.getOverlay().addEvents([{
        callback: this.hide,
        eventName: Modal.EVENT_CLOSE
      }]);
    }
  }

  public hide(): void {
    this.modal.classList.remove(Modal.ACTIVE_CLASS);
    this.overlay.hide();

    if (this.closeOnOverlay) {
      this.overlay.getOverlay().removeEvents([{
        callback: this.hide,
        eventName: Modal.EVENT_CLOSE
      }]);
    }
  }
}

export { Modal };
