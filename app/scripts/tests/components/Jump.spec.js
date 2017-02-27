import { Jump } from '../../components/Jump';

describe('Jump component specification', () => {
  let jumpHandler;
  let elementToJump;
  let clock;

  beforeEach(() => {
    let contentId = 'jump-content-id';

    jumpHandler = document.createElement('div');
    jumpHandler.setAttribute(Jump.ATTR, contentId);
    document.body.appendChild(jumpHandler);

    elementToJump = document.createElement('div');
    elementToJump.id = contentId;
    document.body.appendChild(elementToJump);

    clock = sinon.useFakeTimers();
  });

  it('should create a Jump component with correct properties', () => {
    let jumpComponent = new Jump(jumpHandler);

    expect(jumpComponent.handler).to.equal(jumpHandler);
    expect(jumpComponent.element).to.equal(elementToJump);
  });

  it('should called once jump function', () => {
    let jumpComponent = new Jump(jumpHandler);
    let spy = sinon.spy(jumpComponent, 'jump');
    let event = { preventDefault: () => 0 };

    assert(spy.notCalled);

    jumpComponent.jump(event);
    assert(spy.calledOnce);
  });

  it('should top getBoundingClientRect to be equals than getOffsetTop', () => {
    let jumpComponent = new Jump(jumpHandler);
    let handlerRect = jumpHandler.getBoundingClientRect();
    let elementToJumpRect = elementToJump.getBoundingClientRect();

    expect(jumpComponent.getOffsetTop(jumpHandler)).to.be
    .equals(handlerRect.top);

    expect(jumpComponent.getOffsetTop(elementToJump)).to.be
    .equals(elementToJumpRect.top);
  });

  it('should called scrollUp function', () => {
    elementToJump.style.position = 'absolute';
    elementToJump.style.top = '0px';

    jumpHandler.style.position = 'absolute';
    jumpHandler.style.top = '1000px';

    let jumpComponent = new Jump(jumpHandler);
    let spy = sinon.spy(jumpComponent, 'scrollUp');

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

    let jumpComponent = new Jump(jumpHandler);
    let spy = sinon.spy(jumpComponent, 'scrollDown');

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
