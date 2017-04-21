import '../styles/main.scss';
import { Carousel } from './components/Carousel';
import { DOMUtils } from './components/DOMUtils';
import { Dropdown } from './components/Dropdown';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { MenuCollapser } from './components/MenuCollapser';
import { MenuOver } from './components/MenuOver';
import { Modal } from './components/Modal';
import { Mosaic } from './components/Mosaic';
import { ScrollSpy } from './components/ScrollSpy';
import { Swiper } from './components/Swiper';
import { Tab } from './components/Tab';

const tabs = document.querySelectorAll('[data-tab-content-id]');
const modals = document.querySelectorAll('[data-modal-content-id]');
const jumps = document.querySelectorAll('[data-jump-content-id]');
const swiper = document.querySelector('[data-swiper]');
const carousel = document.querySelector('[data-carousel]');
const dropdowns = document.querySelectorAll('[data-dropdown]');
const mosaics = document.querySelectorAll('[data-mosaic]');
const scrollSpies = document.querySelectorAll('[data-scroll-spy]');
const responsiveMenuOver = document.querySelector('[data-menu-over]');
const menuCollapsers = document.querySelectorAll('[data-menu-collapser]');

window.onload = () => {
  new Swiper(swiper, {
    activateTumbnails: false,
    animationMs: 300,
    nextCtrlClasses: ['arrow-right'],
    prevCtrlClasses: ['arrow-left'],
    showBullets: true,
    showControls: true
  });

  new Carousel(carousel, {
    activateTumbnails: false,
    animationMs: 400,
    autoplayMs: 1200,
    nextCtrlClasses: ['arrow-right'],
    prevCtrlClasses: ['arrow-left'],
    showBullets: false,
    showControls: false
  });

  new MenuOver(responsiveMenuOver as HTMLElement, {
    buttonType: 'hamburger-x',
    isMainMenu: true,
    position: 'left',
    showOverlay: true
  });

  DOMUtils.syncForEach(scrollSpy => {
    new ScrollSpy(scrollSpy);
  }, scrollSpies);

  DOMUtils.syncForEach(tab => {
    new Tab(tab as HTMLAnchorElement);
  }, tabs);

  DOMUtils.syncForEach(modal => {
    new Modal(modal);
  }, modals);

  DOMUtils.syncForEach(jump => {
    new Jump(jump as HTMLAnchorElement);
  }, jumps);

  DOMUtils.syncForEach(dropdown => {
    new Dropdown(dropdown);
  }, dropdowns);

  DOMUtils.syncForEach(mosaic => {
    new Mosaic(mosaic);
  }, mosaics);

  DOMUtils.syncForEach(menuCollapser => {
    new MenuCollapser(menuCollapser);
  }, menuCollapsers);

  const loader = Loader.getInstance();

  loader.show();

  setTimeout(() => {
    loader.hide();
  }, 1000);
};
