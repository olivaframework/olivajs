import { expect } from 'chai';
import { Overlay } from '../../components/Overlay';

describe('Overlay component specification', () => {
  it('should create a Overlay component on DOM', () => {
    let overlayComponent = Overlay.getInstance();
    let overlayElement = overlayComponent.getOverlay().getElement();
    let overlay = document.querySelector(`.${ Overlay.STYLE_CLASS }`);

    expect(overlayElement).to.be.not.null;
    expect(overlay).to.be.not.null;
  });

  it('should trow error when create a new Overlay component', () => {
    let overlay = () => new Overlay();

    expect(overlay).to.throw(Error);
  });

  it('should add class active when Overlay is showed', () => {
    let overlayComponent = Overlay.getInstance();
    let overlayElement = overlayComponent.getOverlay().getElement();

    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.false;

    overlayComponent.show();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.true;
  });

  it('should remov class active when Overlay is hidden', () => {
    let overlayComponent = Overlay.getInstance();
    let overlayElement = overlayComponent.getOverlay().getElement();

    overlayComponent.show();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.true;

    overlayComponent.hide();
    expect(overlayElement.classList.contains(Overlay.ACTIVE_CLASS)).to.be.false;
  });
});
