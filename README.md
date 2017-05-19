# OlivaJs

A frontend framework made using Typescript and Sass.

**NOTE:** This package is made using Vanilla JS only and doesn't need extra libraries to work.

## Quick start

### Install

This package can be installed with:

* [npm](https://www.npmjs.com/package/olivajs): `npm install --save olivajs`

### How to use it

`var oliva = require ('olivajs');`

### Static HTML

Put the required stylesheet at the top of your markup:

`<link rel="stylesheet" href="/node_modules/olivajs/dist/css/oliva.css" />`

Put the script at the bottom of your markup:

`<script src="/node_modules/olivajs/dist/js/oliva.js"></script>`

## Documentation

The documentation and demos are available at https://olivaframework.github.io/olivajs/.

## Building

This package comes with Webpack 2 and the following tasks are available:

* `build` compiles the CSS and JS into `/dist` and builds the doc.

* `start` watches source files and builds them automatically with eval.

* `test` runs unit tests in PhantomJS.

* `coverage` runs unit tests and generate coverage html files on `/app/tests/coverage`.
