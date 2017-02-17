import { Tab } from '../../components/Tab';

describe('Tab component specification', () => {
  let tabsContainer;
  let tabContentContainer;
  let tabIdA = 'tab-id-A';
  let tabIdB = 'tab-id-B';
  let tabContentAId = 'tab-content-A';
  let tabContentBId = 'tab-content-B';

  beforeEach(() => {
    let tabA = document.createElement('a');
    let tabB = document.createElement('a');
    let tabContentA = document.createElement('div');
    let tabContentB = document.createElement('div');

    tabsContainer = document.createElement('div');
    tabContentContainer = document.createElement('div');

    tabContentA.id = tabContentAId;
    tabContentB.id = tabContentBId;

    tabA.id = tabIdA;
    tabB.id = tabIdB;

    tabA.setAttribute(Tab.ATTR, tabContentAId);
    tabB.setAttribute(Tab.ATTR, tabContentBId);

    tabsContainer.appendChild(tabA);
    tabsContainer.appendChild(tabB);

    tabContentContainer.appendChild(tabContentA);
    tabContentContainer.appendChild(tabContentB);

    document.body.appendChild(tabsContainer);
    document.body.appendChild(tabContentContainer);
  });

  it('should create a Tab with correct properties', () => {
    let tabComponent = new Tab(document.getElementById(tabIdA));

    expect(document.getElementById(tabIdA)).to.be
    .equal(tabComponent.handler);
    expect(document.getElementById(tabContentAId)).to.be
    .equal(tabComponent.content);
  });

  it('should remove active classes when removeActives is called', () => {
    let tabA = document.getElementById(tabIdA);
    let tabComponentA = new Tab(tabA);
    let tabs = tabsContainer.children;

    tabA.click();
    expect(tabA.classList.contains(Tab.ACTIVE_CLASS)).to.be.true;

    tabComponentA.removeActives(tabs);
    expect(tabA.classList.contains(Tab.ACTIVE_CLASS)).to.be.false;

    for (let i = 0; i < tabs.length; i++) {
      expect(tabs[i].classList.contains(Tab.ACTIVE_CLASS)).to.be.false;
    }
  });

  it('should active the correct tab when toggle is called', () => {
    let tabA = document.getElementById(tabIdA);
    let tabB = document.getElementById(tabIdB);
    let tabComponentA = new Tab(tabA);
    let tabComponentB = new Tab(tabB);
    let tabContentA = document.getElementById(tabContentAId);
    let tabContentB = document.getElementById(tabContentBId);
    let event = { preventDefault: () => 0 };

    tabComponentA.toggle(event);
    expect(tabA.classList.contains(Tab.ACTIVE_CLASS)).to.be.true;
    expect(tabB.classList.contains(Tab.ACTIVE_CLASS)).to.be.false;
    expect(tabContentA.classList.contains(Tab.ACTIVE_CLASS)).to.be.true;
    expect(tabContentB.classList.contains(Tab.ACTIVE_CLASS)).to.be.false;

    tabComponentB.toggle(event);
    expect(tabA.classList.contains(Tab.ACTIVE_CLASS)).to.be.false;
    expect(tabB.classList.contains(Tab.ACTIVE_CLASS)).to.be.true;
    expect(tabContentA.classList.contains(Tab.ACTIVE_CLASS)).to.be.false;
    expect(tabContentB.classList.contains(Tab.ACTIVE_CLASS)).to.be.true;
  });

  afterEach(() => {
    tabsContainer.remove();
    tabsContainer = null;

    tabContentContainer.remove();
    tabContentContainer = null;
  });
});
