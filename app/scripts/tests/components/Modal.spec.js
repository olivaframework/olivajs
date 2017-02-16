import { Modal } from '../../components/Modal';

describe('Modal component specification', () => {
  let modalHandler;
  let modalContent;

  beforeEach(() => {
    let modalContentId = 'modal-content-id';

    modalHandler = document.createElement('div');
    modalHandler.setAttribute(Modal.ATTR, modalContentId);
    document.body.appendChild(modalHandler);

    modalContent = document.createElement('div');
    modalContent.id = modalContentId;
    document.body.appendChild(modalContent);
  });

  it('should create a Modal with correct properties', () => {
    let modalComponent = new Modal(modalHandler);

    expect(modalHandler).to.be
    .equal(modalComponent.handler);

    expect(modalContent).to.be
    .equal(modalComponent.modal);
  });

  it('should open a Modal on click', () => {
    new Modal(modalHandler);

    modalHandler.click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.true;
  });

  it('should close a Modal when click on overlay', () => {
    let modalComponent = new Modal(modalHandler);

    modalHandler.click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.true;

    modalComponent.overlay.getOverlay().getElement().click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.false;
  });

  it('should close a Modal when click on close element', () => {
    let closeElement = document.createElement('div');

    closeElement.setAttribute(Modal.ATTR_CLOSE, '');
    closeElement.textContent = 'x';

    modalContent.appendChild(closeElement);

    new Modal(modalHandler);

    modalHandler.click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.true;

    closeElement.click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.false;
  });

  it('should not close a Modalwhen click on overlay', () => {
    modalContent.setAttribute(Modal.ATTR_CLOSE_ON_OVERLAY, false);

    let modalComponent = new Modal(modalHandler);

    modalHandler.click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.true;

    modalComponent.overlay.getOverlay().getElement().click();
    expect(modalContent.classList.contains(Modal.ACTIVE_CLASS)).to.be.true;
  });

  afterEach(() => {
    modalHandler.remove();
    modalHandler = null;

    modalContent.remove();
    modalContent = null;
  });
});
