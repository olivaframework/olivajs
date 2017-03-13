import { expect } from 'chai';
import { Swiper } from '../../components/Swiper';

describe('Swiper component specification', () => {
  let swiper;
  let swiperContainer;
  let prevCtrl;
  let nextCtrl;
  let itemsAmount = 5;
  let swiperOptions= {
    animationMs: 500,
    nextCtrlClasses: ['right-arrow'],
    prevCtrlClasses: ['left-arrow'],
    showControls: true
  }

  beforeEach(() => {
    swiper = document.createElement('div');
    swiper.style.overflow = 'hidden';

    swiperContainer = document.createElement('div');
    swiperContainer.classList.add(Swiper.CONTAINER_CLASS);
    swiperContainer.style.width = '1000px';
    swiperContainer.style.whiteSpace = 'nowrap';

    for (let i = 0; i < itemsAmount; i++) {
      let item = document.createElement('div');

      item.style.width = '500px';
      item.style.display = 'inline-block';
      item.classList.add(Swiper.ITEM_CLASS);
      swiperContainer.appendChild(item);
    }

    swiper.appendChild(swiperContainer);
    swiper.appendChild(prevCtrl);
    swiper.appendChild(nextCtrl);
    document.body.appendChild(swiper);
  });

  it('should create a Swiper component with correct properties', () => {
    let swiperComponent = new Swiper(swiper, swiperOptions);

    expect(swiperComponent.container).to.equals(swiperContainer);
    expect(swiperComponent.prevCtrl).to.equals(prevCtrl);
    expect(swiperComponent.nextCtrl).to.equals(nextCtrl);
    expect(swiperComponent.items.length).to.equals(itemsAmount);
    expect(swiperComponent.index).to.equals(0);
    expect(swiperComponent.initDistance).to.equals(0);
  });

  it('should show correct item when showNext is called', () => {
    let swiperComponent = new Swiper(swiper, swiperOptions);

    for (let i = 0; i <= swiperComponent.lastToShow(); i++) {
      if (i < swiperComponent.lastToShow()) {
        expect(swiperComponent.index).to.equals(i);
      } else {
        expect(swiperComponent.index).to.equals(swiperComponent.lastToShow());
      }

      swiperComponent.showNext();
    }
  });

  it('should show previous item when showPrev is called', () => {
    let swiperComponent = new Swiper(swiper, swiperOptions);

    swiperComponent.showNext();
    swiperComponent.showNext();
    expect(swiperComponent.index).to.equals(2);

    for (let i = swiperComponent.index; i >= -1; i--) {
      if (i >= 0) {
        expect(swiperComponent.index).to.equals(i);
      } else {
        expect(swiperComponent.index).to.equals(0);
      }

      swiperComponent.showPrev();
    }
  });

  afterEach(() => {
    swiper.remove();
    swiper = null;

    swiperContainer.remove();
    swiperContainer = null;

    prevCtrl.remove();
    prevCtrl = null;

    nextCtrl.remove();
    nextCtrl = null;
  });
});
