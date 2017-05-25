import { ScrollSpy } from '../scripts/ScrollSpy';

describe('ScrollSpy component specification', () => {
  let scrollSpyHandler;

  beforeEach(() => {
    scrollSpyHandler = document.createElement('div');
    document.body.appendChild(scrollSpyHandler);
  });

  it('should create a ScrollSpy component with correct properties', () => {
    const spy = sinon.spy(window, 'onEvent');
    const scrollSpyComponent = new ScrollSpy(scrollSpyHandler);
    const calledFunction = scrollSpyComponent.validatePosition;
    const calledTime = 1;
    const calledEvent = ScrollSpy.EVENT_ACTIVE;

    expect(scrollSpyComponent.handler).to.equals(scrollSpyHandler);

    assert(spy.calledWith(calledEvent, calledFunction, calledTime));
  });

  it('should active or desactivate class on validatePosition method', () => {
    const scrollSpyComponent = new ScrollSpy(scrollSpyHandler);
    const stub = sinon.stub(window, 'scrollTop');

    stub.onFirstCall().returns(1000);
    stub.onSecondCall().returns(0);

    expect(stub.called).to.be.false;
    expect(scrollSpyHandler.classList.contains(ScrollSpy.ACTIVE_CLASS))
    .to.be.false;

    scrollSpyComponent.validatePosition();

    expect(stub.called).to.be.true;
    expect(scrollSpyHandler.classList.contains(ScrollSpy.ACTIVE_CLASS))
    .to.be.true;

    scrollSpyComponent.validatePosition();
    expect(scrollSpyHandler.classList.contains(ScrollSpy.ACTIVE_CLASS))
    .to.be.false;

    stub.resetBehavior();
  });

  afterEach(() => {
    scrollSpyHandler.remove();
    scrollSpyHandler = null;
  });
});
