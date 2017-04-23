import { Jump } from '../scripts/Jump';

describe('Jump component specification', () => {
  let jumpHandler;
  let elementToJump;
  let clock;

  beforeEach(() => {
    const contentId = 'jump-content-id';

    jumpHandler = document.createElement('div');
    jumpHandler.setAttribute(Jump.ATTR, contentId);
    document.body.appendChild(jumpHandler);

    elementToJump = document.createElement('div');
    elementToJump.id = contentId;
    document.body.appendChild(elementToJump);

    clock = sinon.useFakeTimers();
  });

  it('should create a Jump component with correct properties', () => {
    const jumpComponent = new Jump(jumpHandler);

    expect(jumpComponent.handler).to.equal(jumpHandler);
    expect(jumpComponent.element).to.equal(elementToJump);
  });

  it('should called once jump function', () => {
    const jumpComponent = new Jump(jumpHandler);
    const spy = sinon.spy(jumpComponent, 'jump');
    const event = { preventDefault: () => 0 };

    assert(spy.notCalled);

    jumpComponent.jump(event);
    assert(spy.calledOnce);
  });

  it('should called scrollUp function', () => {
    elementToJump.style.position = 'absolute';
    elementToJump.style.top = '0px';

    jumpHandler.style.position = 'absolute';
    jumpHandler.style.top = '1000px';

    const jumpComponent = new Jump(jumpHandler);
    const spy = sinon.spy(jumpComponent, 'scrollUp');

    assert(spy.notCalled);

    jumpHandler.click();
    assert(spy.calledOnce);

    clock.tick(Jump.SCROLL_VELOCITY_MS);
    assert(spy.calledTwice);
  });

  it('should called scrollDown function', () => {
    elementToJump.style.position = 'absolute';
    elementToJump.style.top = '1000px';

    jumpHandler.style.position = 'absolute';
    jumpHandler.style.top = '0px';

    const jumpComponent = new Jump(jumpHandler);
    const spy = sinon.spy(jumpComponent, 'scrollDown');
    const stub = sinon.stub(window, 'getInnerHeight');

    stub.onFirstCall().returns(0);
    stub.onSecondCall().returns(-100);

    assert(spy.notCalled);

    jumpHandler.click();
    assert(spy.calledOnce);

    clock.tick(Jump.SCROLL_VELOCITY_MS);
    assert(spy.calledTwice);
  });

  afterEach(() => {
    jumpHandler.remove();
    jumpHandler = null;

    elementToJump.remove();
    elementToJump = null;

    clock.restore();
  });
});
