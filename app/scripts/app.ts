import '../styles/main.scss';
import { Carousel } from './components/Carousel';
import { DOMUtils } from './components/DOMUtils';
import { Dropdown } from './components/Dropdown';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { Modal } from './components/Modal';
import { Mosaic } from './components/Mosaic';
import { ScrollSpy } from './components/ScrollSpy';
import { Swiper } from './components/Swiper';
import { Tab } from './components/Tab';

document.title = 'Banco Pichincha';

let tabs = document.querySelectorAll('[data-tab-content-id]');
let modals = document.querySelectorAll('[data-modal-content-id]');
let jumps = document.querySelectorAll('[data-jump-content-id]');
let swipers = document.querySelectorAll('[data-swiper]');
let dropdowns = document.querySelectorAll('[data-dropdown]');
let carousels = document.querySelectorAll('[data-carousel]');
let mosaics = document.querySelectorAll('[data-mosaic]');
let scrollSpies = document.querySelectorAll('[data-scroll-spy]');

DOMUtils.syncForEach(scrollSpy => {
  new ScrollSpy(scrollSpy);
}, scrollSpies);

DOMUtils.syncForEach(tab => {
  new Tab(tab);
}, tabs);

DOMUtils.syncForEach(modal => {
  new Modal(modal);
}, modals);

DOMUtils.syncForEach(jump => {
  new Jump(jump);
}, jumps);

DOMUtils.syncForEach(swiper => {
  new Swiper(swiper);
}, swipers);

DOMUtils.syncForEach(dropdown => {
  new Dropdown(dropdown);
}, dropdowns);

DOMUtils.syncForEach(carousel => {
  new Carousel(carousel);
}, carousels);

DOMUtils.syncForEach(mosaic => {
  new Mosaic(mosaic);
}, mosaics);

let loader = Loader.getInstance();

loader.show();

setTimeout(() => {
  loader.hide();
}, 1000);
