import { expect } from 'chai';
import { Loader } from '../../components/Loader';

describe('Loader component specification', () => {
  it('should create a Loader component on DOM', () => {
    let loaderComponent = Loader.getInstance();
    let loaderElement = loaderComponent.getLoader().getElement();
    let loader = document.querySelector(`.${ Loader.STYLE_CLASS }`);

    expect(loaderElement).to.be.not.null;
    expect(loader).to.be.not.null;
  });

  it('should trow error when create a new Loader component', () => {
    let loader = () => new Loader();

    expect(loader).to.throw(Error);
  });

  it('should add class active when Loader is showed', () => {
    let loaderComponent = Loader.getInstance();
    let loaderElement = loaderComponent.getLoader().getElement();

    expect(loaderElement.classList.contains(Loader.ACTIVE_CLASS)).to.be.false;

    loaderComponent.show();
    expect(loaderElement.classList.contains(Loader.ACTIVE_CLASS)).to.be.true;
  });

  it('should remov class active when Loader is hidden', () => {
    let loaderComponent = Loader.getInstance();
    let loaderElement = loaderComponent.getLoader().getElement();

    loaderComponent.show();
    expect(loaderElement.classList.contains(Loader.ACTIVE_CLASS)).to.be.true;

    loaderComponent.hide();
    expect(loaderElement.classList.contains(Loader.ACTIVE_CLASS)).to.be.false;
  });
});
