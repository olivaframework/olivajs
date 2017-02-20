import '../styles/main.scss';
import './components/Window';
import { DOMIterator } from './components/DOMIterator';
import { Http } from './components/Http';
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

function onFail() {
  console.log('Failed!!!');
}

function onSuccess() {
  console.log('---- Finished request!!!');
}

let ajaxLoader = Loader.getInstance();
let loaderFlag = false;

ajaxLoader.show();
setInterval(() => {
  loaderFlag = !loaderFlag;
  loaderFlag ? ajaxLoader.hide(): ajaxLoader.show();
}, 3000);

let getRequest = new Http(
  {url: 'https://jsonplaceholder.typicode.com/posts/1'}
);

getRequest.get({
  failure: onFail,
  success: onSuccess
});

//
// setInterval(function () {
//   getRequest.get({
//     failure: onFail,
//     success: onSuccess
//   })
// }, 5000);
