import '../styles/main.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './app.config';
import home from './home/home.module';

angular.module('app', [uirouter, home])
  .config(routing);
