var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'app/scripts/test/**/*.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      'app/scripts/test/**/*.ts': ['webpack']
    },
    webpack: {
      debug: true,
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
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
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}
