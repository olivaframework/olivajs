import { DOMUtils } from '../src/scripts/DOMUtils';

describe('DOMUtils component specification', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should trow error when create a new DOMUtils component', () => {
    const domUtils = () => new DOMUtils();

    expect(domUtils).to.throw(Error);
  });

  it('should remove classes to elements on removeClassToItems method', () => {
    const className = 'className';
    const amountElements = 5;

    for (let i = 0; i < amountElements; i++) {
      const element = document.createElement('div');

      element.classList.add(className);
      container.appendChild(element);
    }

    const elements = container.querySelectorAll(`.${ className }`);

    for (let i = 0; i < amountElements; i++) {
      expect(elements[i].classList.contains(className)).to.be.true;
    }

    DOMUtils.removeClassToItems(elements, className);

    for (let i = 0; i < amountElements; i++) {
      expect(elements[i].classList.contains(className)).to.be.false;
    }
  });

  it('should run callback on syncForEach method', () => {
    const amountElements = 5;
    const className = 'className';

    for (let i = 0; i < amountElements; i++) {
      const element = document.createElement('div');

      element.classList.add(className);
      container.appendChild(element);
    }

    const elements = container.querySelectorAll(`.${ className }`);
    const callback = sinon.spy();

    DOMUtils.syncForEach(callback, elements);
    assert.equal(callback.callCount, amountElements);
  });

  it('should find right parentNode on findParentElementByClass method', () => {
    const childClass = 'childClass';
    const parentClass = 'parentClass';
    const child = document.createElement('div');
    const parent = document.createElement('div');

    child.classList.add(childClass);
    parent.appendChild(child);
    container.classList.add(parentClass);
    container.appendChild(parent);

    const foundParent = DOMUtils.findParentElementByClass(child, parentClass);

    expect(container).to.be.equals(foundParent);
  });

  it('should remove specific elements on removeElements method', () => {
    const item1 = document.createElement('div');
    const item2 = document.createElement('div');
    const item3 = document.createElement('div');

    container.appendChild(item1);
    container.appendChild(item2);
    container.appendChild(item3);

    let items = container.children;

    expect(items.length).to.be.equals(3);

    DOMUtils.removeElements([item1, item2]);

    items = container.children;

    expect(items.length).to.be.equals(1);
  });

  it('should remove all elements on removeAllChildren method', () => {
    const item1 = document.createElement('div');
    const item2 = document.createElement('div');
    const item3 = document.createElement('div');

    container.appendChild(item1);
    container.appendChild(item2);
    container.appendChild(item3);

    let items = container.children;

    expect(items.length).to.be.equals(3);

    DOMUtils.removeAllChildren(container);

    items = container.children;

    expect(items.length).to.be.equals(0);
  });

  it('should get correct index node on getIndexNode method', () => {
    const amountElements = 5;
    const indexNode = 3;
    const className = 'className';
    let element = null;

    for (let i = 0; i < amountElements; i++) {
      const item = document.createElement('div');

      item.classList.add(className);
      container.appendChild(item);

      if (i === indexNode - 1) {
        element = item;
      }
    }

    expect(DOMUtils.getIndexNode(element)).to.be.equals(indexNode);
  });

  it('should add class on addClass method', () => {
    const className = 'className';

    expect(container.classList.contains(className)).to.be.false;

    DOMUtils.addClass(container, className);
    expect(container.classList.contains(className)).to.be.true;
  });

  it('should add classes to items on addClassToItems method', () => {
    const item1 = document.createElement('div');
    const item2 = document.createElement('div');
    const item3 = document.createElement('div');

    container.appendChild(item1);
    container.appendChild(item2);
    container.appendChild(item3);

    const items = container.children;

    for (let i = 0; i < items.length; i++) {
      expect(items[i].classList.contains('item')).to.be.false;
    }

    DOMUtils.addClassToItems(items, 'item');

    for (let i = 0; i < items.length; i++) {
      expect(items[i].classList.contains('item')).to.be.true;
    }
  });

  it('should remove class on removeClass method', () => {
    const className = 'className';
    const className2 = 'className2';
    const className3 = 'className3';

    container.classList.add(className);
    container.classList.add(className2);
    container.classList.add(className3);

    expect(container.classList.contains(className)).to.be.true;
    expect(container.classList.contains(className2)).to.be.true;
    expect(container.classList.contains(className3)).to.be.true;

    DOMUtils.removeClass(container, className2);

    expect(container.classList.contains(className)).to.be.true;
    expect(container.classList.contains(className2)).to.be.false;
    expect(container.classList.contains(className3)).to.be.true;
  });

  it('should remove specific classes on removeClasses method', () => {
    const className1 = 'className1';
    const className2 = 'className2';
    const className3 = 'className3';

    container.classList.add(className1);
    container.classList.add(className2);
    container.classList.add(className3);

    expect(container.classList.contains(className1)).to.be.true;
    expect(container.classList.contains(className2)).to.be.true;
    expect(container.classList.contains(className3)).to.be.true;

    DOMUtils.removeClasses(container, [className1, className3]);

    expect(container.classList.contains(className1)).to.be.false;
    expect(container.classList.contains(className2)).to.be.true;
    expect(container.classList.contains(className3)).to.be.false;
  });

  it('should toggle class on toggleClass method', () => {
    const className = 'className';

    expect(container.classList.contains(className)).to.be.false;

    DOMUtils.toggleClass(container, className);
    expect(container.classList.contains(className)).to.be.true;

    DOMUtils.toggleClass(container, className);
    expect(container.classList.contains(className)).to.be.false;
  });

  it('should check if an element has class on containsClass method', () => {
    const className = 'className';

    expect(DOMUtils.containsClass(container, className)).to.be.false;

    container.classList.add(className);
    expect(DOMUtils.containsClass(container, className)).to.be.true;

    container.classList.remove(className);
    expect(DOMUtils.containsClass(container, className)).to.be.false;
  });

  it('should top getBoundingClientRect to be equals than getOffset', () => {
    container.style.marginTop = '10px';
    container.style.marginLeft = '10px';

    let containerRect = container.getBoundingClientRect();
    let offset = DOMUtils.getOffset(container);

    expect(offset.top).to.be.equals(containerRect.top);
    expect(offset.left).to.be.equals(containerRect.left);

    container.style.marginTop = '120px';
    container.style.marginLeft = '120px';

    containerRect = container.getBoundingClientRect();
    offset = DOMUtils.getOffset(container);

    expect(offset.top).to.be.equals(containerRect.top);
    expect(offset.left).to.be.equals(containerRect.left);
  });

  it('should get number of items per row in any container', () => {
    const item1 = document.createElement('div');
    const item2 = document.createElement('div');
    const item3 = document.createElement('div');
    const item4 = document.createElement('div');

    item1.classList.add('item');
    item2.classList.add('item');
    item3.classList.add('item');
    item4.classList.add('item');

    item1.style.width = '51px';
    item2.style.width = '51px';
    item3.style.width = '100px';
    item4.style.width = '100px';

    container.style.width = '100px';
    container.appendChild(item1);
    container.appendChild(item2);
    container.appendChild(item3);
    container.appendChild(item4);

    const itemsPerSection = DOMUtils.itemsPerSection(container, 'item');

    expect(itemsPerSection[0]).to.equals(2);
    expect(itemsPerSection[1]).to.equals(1);
    expect(itemsPerSection[2]).to.equals(1);
  });

  it('should dispatch custom event on dispatchCustomEvent method', () => {
    const element = document.createElement('div');
    const spy = sinon.spy();
    const eventName = 'myEvent';

    element.addEventListener(eventName, spy);

    container.appendChild(element);
    assert(spy.notCalled);

    DOMUtils.dispatchCustomEvent(element, eventName);
    assert(spy.calledOnce);

    DOMUtils.dispatchCustomEvent(element, eventName);
    assert(spy.calledTwice);
  });

  afterEach(() => {
    container.remove();
    container = null;
  });
});
