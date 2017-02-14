import '../styles/main.scss';
import './components/Window';
import { Http } from './components/Http';

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
