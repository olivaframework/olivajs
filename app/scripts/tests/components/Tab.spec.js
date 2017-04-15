import { expect } from 'chai';
import { Tab } from '../../components/Tab';

describe('Tab component specification', () => {
  let tabsContainer;
  let tabContentContainer;
  const tabIdA = 'tab-id-A';
  const tabIdB = 'tab-id-B';
  const tabContentAId = 'tab-content-A';
  const tabContentBId = 'tab-content-B';

  beforeEach(() => {
    const tabA = document.createElement('a');
    const tabB = document.createElement('a');
    const tabContentA = document.createElement('div');
    const tabContentB = document.createElement('div');

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
    const tab = document.getElementById(tabIdA);
    const tabComponent = new Tab(tab);

    expect(document.getElementById(tabIdA)).to.be
    .equal(tabComponent.handler);
    expect(document.getElementById(tabContentAId)).to.be
    .equal(tabComponent.content);
  });

  it('should active the correct tab when toggle is called', () => {
    const tabA = document.getElementById(tabIdA);
    const tabB = document.getElementById(tabIdB);
    const tabComponentA = new Tab(tabA);
    const tabComponentB = new Tab(tabB);
    const tabContentA = document.getElementById(tabContentAId);
    const tabContentB = document.getElementById(tabContentBId);
    const event = { preventDefault: () => 0 };

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
