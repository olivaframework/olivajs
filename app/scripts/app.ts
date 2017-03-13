import '../styles/main.scss';
import { Carousel } from './components/Carousel';
import { DOMUtils } from './components/DOMUtils';
import { Dropdown } from './components/Dropdown';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { Modal } from './components/Modal';
import { Mosaic } from './components/Mosaic';
import { ResponsiveMenu } from './components/ResponsiveMenu';
import { ScrollSpy } from './components/ScrollSpy';
import { Swiper } from './components/Swiper';
import { Tab } from './components/Tab';

let tabs = document.querySelectorAll('[data-tab-content-id]');
let modals = document.querySelectorAll('[data-modal-content-id]');
let jumps = document.querySelectorAll('[data-jump-content-id]');
let swiper = document.querySelector('[data-swiper]');
let carousel = document.querySelector('[data-carousel]');
let dropdowns = document.querySelectorAll('[data-dropdown]');
let mosaics = document.querySelectorAll('[data-mosaic]');
let scrollSpies = document.querySelectorAll('[data-scroll-spy]');
let responsiveMenus = document.querySelectorAll('[data-responsive-menu]');

window.onload = () => {
  new Swiper(swiper, {
    animationMs: 300,
    nextCtrlClasses: ['arrow-right'],
    prevCtrlClasses: ['arrow-left'],
    showControls: true
  });

  new Carousel(carousel, {
    animationMs: 400,
    autoplayMs: 1200,
    nextCtrlClasses: ['arrow-right'],
    prevCtrlClasses: ['arrow-left'],
    showControls: true
  });

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

  DOMUtils.syncForEach(dropdown => {
    new Dropdown(dropdown);
  }, dropdowns);

  DOMUtils.syncForEach(mosaic => {
    new Mosaic(mosaic);
  }, mosaics);

  DOMUtils.syncForEach(responsiveMenu => {
    new ResponsiveMenu(responsiveMenu);
  }, responsiveMenus);

  let loader = Loader.getInstance();

  loader.show();

  setTimeout(() => {
    loader.hide();
  }, 1000);
};
