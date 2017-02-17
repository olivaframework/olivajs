import '../styles/main.scss';
import './components/Window';
import { DOMIterator } from './components/DOMIterator';
import { Modal } from './components/Modal';
import { Tab } from './components/Tab';

document.title = 'Banco Pichincha';

let iteratorTabs = new DOMIterator('[data-tab-content-id]');
let iteratorModals = new DOMIterator('[data-modal-content-id]');

iteratorTabs.syncForEach(function (tab) {
  new Tab(tab);
});

iteratorModals.syncForEach(function (modal) {
  new Modal(modal);
});
