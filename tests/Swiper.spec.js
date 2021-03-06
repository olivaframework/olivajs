import { Swiper } from '../src/scripts/Swiper';

describe('Swiper component specification', () => {
  let swiper;
  let swiperContainer;
  const itemsAmount = 5;
  const swiperOptions = {
    activateTumbnails: false,
    animationMs: 500,
    nextCtrlClasses: ['right-arrow'],
    prevCtrlClasses: ['left-arrow'],
    showBullets: false,
    showControls: true
  };

  beforeEach(() => {
    swiper = document.createElement('div');
    swiper.style.overflow = 'hidden';

    const swiperSection = document.createElement('div');

    swiperSection.classList.add(Swiper.SWIPER_CLASS);
    swiperContainer = document.createElement('div');
    swiperContainer.classList.add(Swiper.CONTAINER_CLASS);
    swiperContainer.style.width = '1000px';
    swiperContainer.style.whiteSpace = 'nowrap';

    for (let i = 0; i < itemsAmount; i++) {
      const item = document.createElement('div');

      item.style.width = '500px';
      item.style.display = 'inline-block';
      item.classList.add(Swiper.ITEM_CLASS);
      swiperContainer.appendChild(item);
    }

    swiperSection.appendChild(swiperContainer);
    swiper.appendChild(swiperSection);
    document.body.appendChild(swiper);
  });

  it('should create a Swiper component with correct properties', () => {
    const swiperComponent = new Swiper(swiper, swiperOptions);

    expect(swiperComponent.container).to.equals(swiperContainer);
    expect(swiperComponent.items.length).to.equals(itemsAmount);
    expect(swiperComponent.index).to.equals(0);
    expect(swiperComponent.initDistance).to.equals(0);
  });

  it('should show correct item when showNext is called', () => {
    const swiperComponent = new Swiper(swiper, swiperOptions);

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
    const swiperComponent = new Swiper(swiper, swiperOptions);

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
  });
});
