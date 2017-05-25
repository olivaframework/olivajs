"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMElement_1 = require("./DOMElement");
var LoaderBar = (function () {
    function LoaderBar() {
        LoaderBar.activeRequests = 0;
        LoaderBar.progress = 0;
        if (LoaderBar.instance) {
            throw new Error('Error: Use Loader.getInstance() instead of new.');
        }
        window.addEventListener('http-sent', LoaderBar.addRequest);
        window.addEventListener('http-loading', LoaderBar.changeProgress);
        window.addEventListener('http-finished', LoaderBar.removeRequest);
        LoaderBar.loaderbar = new DOMElement_1.DOMElement(LoaderBar.LOADERBAR_ELEMENT);
        LoaderBar.loaderbar.addClasses([LoaderBar.LOADERBAR_CLASS]);
        LoaderBar.loaderbar.addClasses([LoaderBar.ACTIVE_CLASS]);
        LoaderBar.loaderbar.render(document.body);
    }
    LoaderBar.addRequest = function () {
        if (LoaderBar.activeRequests === 0) {
            LoaderBar.show();
        }
        LoaderBar.activeRequests = LoaderBar.activeRequests + 1;
    };
    LoaderBar.removeRequest = function () {
        if (LoaderBar.activeRequests === 0) {
            LoaderBar.hide();
            LoaderBar.progress = 0;
        }
        else {
            LoaderBar.activeRequests = LoaderBar.activeRequests - 1;
        }
    };
    LoaderBar.show = function () {
        LoaderBar.loaderbar.addClasses([LoaderBar.ACTIVE_CLASS]);
    };
    LoaderBar.changeProgress = function () {
        LoaderBar.progress = LoaderBar.progress
            + ((100 - LoaderBar.progress) / 5);
        LoaderBar.changeWidth(LoaderBar.progress);
    };
    LoaderBar.changeWidth = function (width) {
        LoaderBar.loaderbar.getElement().style.width = width + "%";
    };
    LoaderBar.hide = function () {
        LoaderBar.changeWidth(100);
        LoaderBar.loaderbar.removeClasses([LoaderBar.ACTIVE_CLASS]);
    };
    LoaderBar.getInstance = function () {
        return LoaderBar.instance;
    };
    return LoaderBar;
}());
LoaderBar.ACTIVE_CLASS = 'loading';
LoaderBar.LOADERBAR_CLASS = 'loader-bar';
LoaderBar.LOADERBAR_ELEMENT = 'div';
LoaderBar.instance = new LoaderBar();
exports.LoaderBar = LoaderBar;
//# sourceMappingURL=LoaderBar.js.map