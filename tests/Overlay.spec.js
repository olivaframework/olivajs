import { Overlay } from '../src/scripts/Overlay';

describe('Overlay component specification', () => {
  it('should create a Overlay component on DOM', () => {
    const overlayComponent = Overlay.getInstance();
    const overlayElement = overlayComponent.getOverlay().getElement();
    const overlay = document.querySelector(`.${ Overlay.STYLE_CLASS }`);

    expect(overlayElement).to.be.not.null;
    expect(overlay).to.be.not.null;
  });

  it('should trow error when create a new Overlay component', () => {
    const overlay = () => new Overlay();

    expect(overlay).to.throw(Error);
  });

  it('should add class active when Overlay is showed', () => {
    const overlayComponent = Overlay.getInstance();
    const overlayElement = overlayComponent.getOverlay().getElement();

    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.false;

    overlayComponent.show();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.true;
  });

  it('should remov class active when Overlay is hidden', () => {
    const overlayComponent = Overlay.getInstance();
    const overlayElement = overlayComponent.getOverlay().getElement();

    overlayComponent.show();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.true;

    overlayComponent.hide();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.false;
  });
});
