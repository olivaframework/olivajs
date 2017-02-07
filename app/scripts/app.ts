'use strict';

import '../styles/main.scss';
import { Test } from './components/test';
import { Test2 } from './components/test2';

const testing = new Test('123');
const testing2 = new Test2(1, 3);

testing.sendMessage();
testing2.sum();

document.title = 'Banco Pichincha';
