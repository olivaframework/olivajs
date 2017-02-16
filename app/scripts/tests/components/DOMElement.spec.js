import { DOMElement } from '../../components/DOMElement';

describe('DOMElement component specification', () => {
  let domElement;

  beforeEach(() => {
    domElement = new DOMElement('div');
  });

  it('should create a div element on body', () => {
    domElement.setId('dom_element');
    domElement.render(document.body);

    expect(document.querySelector('#dom_element')).to.be
    .equals(domElement.getElement());
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

    expect(domElement.getElement().classList[0]).to.be
    .equals(classes[1]);

    expect(domElement.getElement().classList.length).to.be
    .equals(classes.length - removedClasses.length);
  });

  it('should create a div element with correct content', () => {
    const content = 'this is a content';

    domElement.setContent(content);
    domElement.render(document.body);

    expect(domElement.getElement().textContent).to.be
    .equals(content);
  });

  it('should create a div element with events', () => {
    let callback1 = sinon.spy();
    let callback2 = sinon.spy();

    const events = [{
      callback: callback1,
      eventName: 'click'
    }, {
      callback: callback2,
      eventName: 'click'
    }];

    domElement.addEvents(events);
    domElement.render(document.body);

    domElement.getElement().click();
    assert(callback1.calledOnce);

    domElement.getElement().click();
    assert(callback2.calledTwice);
  });

  it('should remove div specific events', () => {
    let callback1 = sinon.spy();
    let callback2 = sinon.spy();

    const events = [{
      callback: callback1,
      eventName: 'click'
    }, {
      callback: callback2,
      eventName: 'click'
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

  afterEach(() => {
    domElement.destroy();
    domElement = null;
  });
});
