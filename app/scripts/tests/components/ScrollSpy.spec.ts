import { assert, expect } from 'chai';
import { ScrollSpy } from '../../components/ScrollSpy';

describe('ScrollSpy component specification', () => {
  let scrollSpyHandler;

  beforeEach(() => {
    scrollSpyHandler = document.createElement('div');
    document.body.appendChild(scrollSpyHandler);
  });

  it('should create a ScrollSpy component with correct properties', () => {
    let spy = sinon.spy(window, 'onEvent');
    let scrollSpyComponent = new ScrollSpy(scrollSpyHandler);
    let calledFunction = scrollSpyComponent.validatePosition;
    let calledTime = 1;
    let calledEvent = ScrollSpy.EVENT_ACTIVE;

    expect(scrollSpyComponent.handler).to.equals(scrollSpyHandler);

    assert(spy.calledWith(calledEvent, calledFunction, calledTime));
  });

  it('should active or desactivate class on validatePosition method', () => {
    let scrollSpyComponent = new ScrollSpy(scrollSpyHandler);
    let stub = sinon.stub(window, 'scrollTop');

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
