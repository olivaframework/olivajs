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

  it('should add active class on window scroll event', () => {
    // let scrollSpyComponent = new ScrollSpy(scrollSpyHandler);
    // let spy = sinon.spy(scrollSpyComponent, 'validatePosition');

    scrollSpyHandler.style.height = '600px';
    window.dispatchEvent(new Event('scroll'));
  });

  afterEach(() => {
    scrollSpyHandler.remove();
    scrollSpyHandler = null;
  });
});
