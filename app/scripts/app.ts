import '../styles/main.scss';
import './components/Window';
import { Carousel } from './components/Carousel';
import { DOMIterator } from './components/DOMIterator';
import { Dropdown } from './components/Dropdown';
import { Gallery } from './components/Gallery';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { Modal } from './components/Modal';
import { Swiper } from './components/Swiper';
import { Tab } from './components/Tab';

document.title = 'Banco Pichincha';

let iteratorTabs = new DOMIterator('[data-tab-content-id]');
let iteratorModals = new DOMIterator('[data-modal-content-id]');
let iteratorJumps = new DOMIterator('[data-jump-content-id]');
let iteratorSwipers = new DOMIterator('[data-swiper]');
let iteratorDropdowns = new DOMIterator('[data-dropdown]');
let iteratorCarousels = new DOMIterator('[data-carousel]');
let iteratorGallery = new DOMIterator('[data-gallery]');

iteratorTabs.syncForEach(function (tab) {
  new Tab(tab);
});

iteratorModals.syncForEach(function (modal) {
  new Modal(modal);
});

iteratorJumps.syncForEach(function (jump) {
  new Jump(jump);
});

iteratorSwipers.syncForEach(function (swiper) {
  new Swiper(swiper);
});

iteratorDropdowns.syncForEach(function (dropdown) {
  new Dropdown(dropdown);
});

iteratorCarousels.syncForEach(function (carousel) {
  new Carousel(carousel);
});

iteratorGallery.syncForEach(function (gallery) {
  new Gallery(gallery);
});

let loader = Loader.getInstance();

loader.show();

setTimeout(() => {
  loader.hide();
}, 1000);
