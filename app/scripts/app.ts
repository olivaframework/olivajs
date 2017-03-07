import '../styles/main.scss';
import { Carousel } from './components/Carousel';
import { DOMIterator } from './components/DOMIterator';
import { Dropdown } from './components/Dropdown';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { Modal } from './components/Modal';
import { Mosaic } from './components/Mosaic';
import { Swiper } from './components/Swiper';
import { Tab } from './components/Tab';

document.title = 'Banco Pichincha';

let iteratorTabs = new DOMIterator('[data-tab-content-id]');
let iteratorModals = new DOMIterator('[data-modal-content-id]');
let iteratorJumps = new DOMIterator('[data-jump-content-id]');
let iteratorSwipers = new DOMIterator('[data-swiper]');
let iteratorDropdowns = new DOMIterator('[data-dropdown]');
let iteratorCarousels = new DOMIterator('[data-carousel]');
let iteratorMosaics = new DOMIterator('[data-mosaic]');

iteratorTabs.syncForEach(tab => {
  new Tab(tab);
});

iteratorModals.syncForEach(modal => {
  new Modal(modal);
});

iteratorJumps.syncForEach(jump => {
  new Jump(jump);
});

iteratorSwipers.syncForEach(swiper => {
  new Swiper(swiper);
});

iteratorDropdowns.syncForEach(dropdown => {
  new Dropdown(dropdown);
});

iteratorCarousels.syncForEach(carousel => {
  new Carousel(carousel);
});

iteratorMosaics.syncForEach(mosaic => {
  new Mosaic(mosaic);
});

let loader = Loader.getInstance();

loader.show();

setTimeout(() => {
  loader.hide();
}, 1000);
