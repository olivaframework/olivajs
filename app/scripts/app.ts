import '../styles/main.scss';
import './components/Window';
import { DOMIterator } from './components/DOMIterator';
import { Http } from './components/Http';
import { Modal } from './components/Modal';
import { Tab } from './components/Tab';

document.title = 'Banco Pichincha';

let http: Http;

http = new Http();

http.get('https://jsonplaceholder.typicode.com/posts/1',
function (data) {
  return data;
},
function (error) {
  return error;
});

let iteratorTabs = new DOMIterator('[data-tab-content-id]');
let iteratorModals = new DOMIterator('[data-modal-content-id]');

iteratorTabs.syncForEach(function (tab) {
  new Tab(tab);
});

iteratorModals.syncForEach(function (modal) {
  new Modal(modal);
});
