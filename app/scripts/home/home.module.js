import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './home.routes';
import homeCtrl from './home.controller';

export default angular
  .module('app.home', [uirouter])
  .config(routing)
  .controller('home.controller', homeCtrl)
  .name;
