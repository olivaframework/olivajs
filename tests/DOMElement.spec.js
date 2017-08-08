import { DOMElement } from '../src/scripts/DOMElement';

describe('DOMElement component specification', () => {
  let domElement;

  beforeEach(() => {
    domElement = new DOMElement('div');
  });

  it('should create a div element on body', () => {
    domElement = new DOMElement('div');
    domElement.setId('dom_element');
    domElement.render(document.body);

    const element = domElement.getElement();

    expect(document.querySelector('#dom_element')).to.be.equals(element);
  });

  it('should create a div element with correct content', () => {
    const content = 'this is a content';

    domElement.setContent(content);
    domElement.render(document.body);

    expect(domElement.getElement().textContent).to.be.equals(content);
  });

  it('should create a div element with events', () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const events = [{
      callback: callback1,
      name: 'click'
    }, {
      callback: callback2,
      name: 'click'
    }];

    domElement.addEvents(events);
    domElement.render(document.body);

    domElement.getElement().click();
    assert(callback1.calledOnce);

    domElement.getElement().click();
    assert(callback2.calledTwice);
  });

  it('should remove div specific events', () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const events = [{
      callback: callback1,
      name: 'click'
    }, {
      callback: callback2,
      name: 'click'
    }];

    domElement.addEvents(events);
    domElement.render(document.body);

    domElement.getElement().click();
    assert(callback1.calledOnce);
    assert(callback2.calledOnce);

    domElement.removeEvents([events[0]]);

    domElement.getElement().click();
    assert(callback1.calledOnce);
    assert(callback2.calledTwice);
  });

  it('should set correct styles to DOMElement', () => {
    const styles = {
      height: '100px',
      width: '100px'
    };

    domElement.setStyles(styles);
    domElement.render(document.body);

    expect(domElement.getElement().style.height).to.be.equals(styles.height);
    expect(domElement.getElement().style.width).to.be.equals(styles.width);
  });

  it('should render in correct position with renderBefore method', () => {
    const positionToInsert = 2;
    const container = document.createElement('div');

    document.body.appendChild(container);

    for (let i = 0; i < 5; i++) {
      const item = new DOMElement('div');

      item.getElement().classList.add('item');
      item.render(container);
    }

    domElement.setId('id');
    domElement.getElement().classList.add('item');
    domElement.renderBefore(container, positionToInsert);

    const items = document.querySelectorAll('.item');
    const element = domElement.getElement();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (i === positionToInsert) {
        expect(element.id).to.be.equals(item.id);
      } else {
        expect(element.id).to.not.equals(item.id);
      }
    }
  });

  it('should set correct attributes with their values to element', () => {
    const attribute1 = {
      name: 'data-attribute-1',
      value: 'attribute-1'
    };
    const attribute2 = {
      name: 'data-attribute-2',
      value: 'attribute-2'
    };

    domElement.setAttributes([attribute1, attribute2]);

    const element = domElement.getElement();

    expect(element.getAttribute(attribute1.name)).equals(attribute1.value);
    expect(element.getAttribute(attribute2.name)).equals(attribute2.value);
  });

  afterEach(() => {
    domElement.destroy();
    domElement = null;
  });
});
