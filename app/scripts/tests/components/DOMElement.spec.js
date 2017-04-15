import { assert, expect } from 'chai';
import { DOMElement } from '../../components/DOMElement';

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

  it('should create a div element on body with correct classes', () => {
    const classes = [
      'class1', 'class2'
    ];

    domElement.render(document.body);
    domElement.addClasses(classes);

    expect(domElement.getElement().classList[0]).to.be
    .equals(classes[0]);

    expect(domElement.getElement().classList[1]).to.be
    .equals(classes[1]);

    expect(domElement.getElement().classList.length).to.be
    .equals(classes.length);
  });

  it('should remove element specific classes', () => {
    const classes = [
      'class1', 'class2', 'class3'
    ];

    const removedClasses = [
      'class1', 'class3'
    ];

    domElement.render(document.body);
    domElement.addClasses(classes);
    domElement.removeClasses(removedClasses);

    expect(domElement.getElement().classList[0]).to.be.equals(classes[1]);

    const classesSize = classes.length - removedClasses.length;

    expect(domElement.getElement().classList.length).to.be.equals(classesSize);
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

      item.addClasses(['item']);
      item.render(container);
    }

    domElement.setId('id');
    domElement.addClasses(['item']);
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

  afterEach(() => {
    domElement.destroy();
    domElement = null;
  });
});
