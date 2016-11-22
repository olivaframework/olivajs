routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: require('./home.tpl.html'),
      controller: 'home.controller',
      controllerAs: 'home'
    });
}
