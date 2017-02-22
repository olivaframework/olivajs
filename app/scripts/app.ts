import '../styles/main.scss';
import './components/Window';
import { DOMIterator } from './components/DOMIterator';
import { Http } from './components/Http';
import { Jump } from './components/Jump';
import { Loader } from './components/Loader';
import { LoaderBar } from './components/LoaderBar';
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


// Ejemplo del spinner central
let spinnerLoader = Loader.getInstance();
let loaderFlag = false;

spinnerLoader.show();
setInterval(() => {
  loaderFlag = !loaderFlag;
  loaderFlag ? spinnerLoader.hide() : spinnerLoader.show();
}, 3000);

// EJEMPLOS DE AJAX

// Inicializamos la barra de carga para las peticiones ajax
LoaderBar.getInstance();
function onFail() {
  console.log('Failed get request!!!');
}

function onSuccess() {
  console.log('---- Success Called!!!');
}

let callbacks = {
  failure: onFail,
  success: onSuccess
};

let getRequest = new Http({url: 'http://geo.groupkt.com/ip/172.217.3.14.htm'});
let getReq2 = new Http({url: 'https://jsonplaceholder.typicode.com/photos'});
let getReq3 = new Http({url: 'https://jsonplaceholder.typicode.com/posts'});

getRequest.get(callbacks);

setTimeout(function () {
  getRequest.get(callbacks);
  getReq2.get(callbacks);
  getReq3.get(callbacks);
}, 3000);
