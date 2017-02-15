import '../styles/main.scss';
import './components/Window';
import { DOMIterator } from './components/DOMIterator';
import { Http } from './components/Http';
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

let iterator = new DOMIterator('[data-tab-content-id]');

iterator.syncForEach(function (tabs) {
  new Tab(tabs);
});
