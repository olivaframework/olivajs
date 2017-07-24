var ENV = process.env.npm_lifecycle_event;
var isCoverage = ENV === 'coverage';
var isPublish = ENV === 'prepare';
var reporters = ['progress'];

if (isCoverage) {
  reporters.push('coverage');
}

var webpackConfig = require('./webpack.config.js');

webpackConfig.module.loaders.push({
  enforce: 'post',
  test: /\.ts$/,
  loader: 'istanbul-instrumenter-loader'
});

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'source-map-support'],
    files: [{
      pattern: 'tests/*.spec.js',
      watched: false
    }],
    exclude: [
    ],
    preprocessors: {
      'src/scripts/*.ts': ['webpack'],
      'tests/*.js': ['webpack']
    },
    webpack: webpackConfig,
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
      dir: 'tests/coverage',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DISABLE,
    autoWatch: !isCoverage,
    autoWatchBatchDelay: 100,
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
          viewportSize: {
            width: 500,
            height: 500
          }
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
    singleRun: isCoverage || isPublish,
    concurrency: Infinity
  })
}
