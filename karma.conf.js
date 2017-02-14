var ENV = process.env.npm_lifecycle_event;
var isCoverage = ENV === 'coverage';
var reporters = ['progress'];

if (isCoverage) {
  reporters.push('coverage');
}

var webpackConfig = require('./webpack.config.js');

webpackConfig.module.postLoaders = [{
    test: /\.ts$/,
    loader: 'istanbul-instrumenter-loader',
    exclude: [/node_modules/,/\.spec\.ts$/]
  }
];

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'source-map-support'],
    files: [{
      pattern: 'app/scripts/tests/**/*.js',
      watched: false
    }],
    exclude: [
    ],
    preprocessors: {
      'app/scripts/**/*.ts': ['webpack'],
      'app/scripts/tests/**/*.js': ['webpack']
    },
    webpack: {
      entry: {},
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      quiet: false,
      noInfo: true,
      reporter: null,
      stats: {
        chunks: false,
        colors: true,
        cached: false
      }
    },
    reporters: reporters,
    coverageReporter: {
      type: 'json',
      dir: 'app/scripts/tests/coverage',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DISABLE,
    autoWatch: !isCoverage,
    autoWatchBatchDelay: 100,
    browsers: ['PhantomJS'],
    singleRun: isCoverage,
    concurrency: Infinity
  })
}
