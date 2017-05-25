"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Window");
var DOMElement_1 = require("./DOMElement");
var DOMUtils_1 = require("./DOMUtils");
var Swiper = (function () {
    function Swiper(swiper, options) {
        this.actionDown = this.actionDown.bind(this);
        this.actionUp = this.actionUp.bind(this);
        this.activateSwipe = this.activateSwipe.bind(this);
        this.animate = this.animate.bind(this);
        this.updateByEvent = this.updateByEvent.bind(this);
        this.showByIndex = this.showByIndex.bind(this);
        this.showPrev = this.showPrev.bind(this);
        this.showNext = this.showNext.bind(this);
        this.changePageByBullet = this.changePageByBullet.bind(this);
        this.swipe = this.swipe.bind(this);
        this.update = this.update.bind(this);
        this.cancelRedirect = this.cancelRedirect.bind(this);
        this.stopAutoplay = this.stopAutoplay.bind(this);
        this.autoplay = this.autoplay.bind(this);
        this.init(swiper);
        this.initFeatures(swiper, options);
    }
    Swiper.prototype.init = function (swiper) {
        this.supportEvents = window.supportTouchEvents()
            ? Swiper.TOUCH_EVENTS
            : Swiper.MOUSE_EVENTS;
        this.index = 0;
        this.initDistance = 0;
        this.traveledDistance = 0;
        this.uid = "swiper-" + new Date().valueOf().toString();
        this.swiper = swiper
            .querySelector("." + Swiper.SWIPER_CLASS);
        this.container = swiper
            .querySelector("." + Swiper.CONTAINER_CLASS);
        this.items = this.container.querySelectorAll("." + Swiper.ITEM_CLASS);
        DOMUtils_1.DOMUtils.addClass(this.items[this.index], Swiper.ITEM_ACTIVE_CLASS);
        this.lastIndexToShow = this.lastToShow();
        this.itemsPerPage = DOMUtils_1.DOMUtils.itemsPerSection(this.items, this.container);
        this.swiper.setAttribute(Swiper.SWIPER_UID_ATTR, this.uid);
        this.swiper.addEventListener(this.uid, this.updateByEvent);
        this.swiper.addEventListener(this.supportEvents.down, this.actionDown);
        this.swiper.addEventListener(this.supportEvents.click, this.cancelRedirect);
        window.onEvent(Swiper.WINDOW_EVENT, this.update, 100);
    };
    Swiper.prototype.initFeatures = function (swiper, options) {
        this.options = options;
        this.setSwiperWidth();
        if (this.options.activateTumbnails) {
            this.activateControlsByIndexes(swiper);
        }
        if (this.options.createControls || this.options.showBullets) {
            this.controlsContainer = new DOMElement_1.DOMElement('div');
            this.controlsContainer.addClasses([Swiper.CTRLS_CONTAINER_CLASS]);
            this.controlsContainer.render(this.swiper.parentNode);
            if (this.options.createControls) {
                this.createControls();
                this.activateControls();
            }
            if (this.options.showBullets) {
                this.bulletsContainer = new DOMElement_1.DOMElement('div');
                this.bulletsContainer.addClasses(['swiper-bullets-container']);
                this.bulletsContainer.render(this.controlsContainer.getElement());
                this.createBullets();
                this.activateBullets();
            }
        }
        if (this.options.loop) {
            this.createClones();
            this.goToPage(1, 0);
        }
        if (this.options.autoplay) {
            this.container.addEventListener(this.supportEvents.move, this.stopAutoplay);
            this.container.addEventListener('mouseout', this.autoplay);
            this.autoplay();
        }
        this.setControls();
    };
    Swiper.prototype.updateIndex = function (index) {
        var _this = this;
        if (this.index !== index) {
            this.index = index;
            DOMUtils_1.DOMUtils.removeClassToItems(this.items, Swiper.ITEM_ACTIVE_CLASS);
            window.setTimeout(function () {
                DOMUtils_1.DOMUtils.addClass(_this.items[_this.index], Swiper.ITEM_ACTIVE_CLASS);
                if (_this.options.onChange !== null) {
                    _this.options.onChange(_this.index);
                }
            }, this.options.animationMs);
        }
    };
    Swiper.prototype.updateByEvent = function () {
        this.setSwiperWidth();
        this.lastIndexToShow = this.lastToShow();
        this.itemsPerPage = DOMUtils_1.DOMUtils.itemsPerSection(this.items, this.container);
        if (this.options.loop) {
            var amountFirstPage = this.itemsPerPage[0];
            var newIndex = (amountFirstPage > 1) ? this.itemsPerPage[0] : 1;
            var currentItem = this.items[newIndex];
            this.updateIndex(newIndex);
            if (currentItem) {
                this.animate(currentItem.offsetLeft, 0);
            }
        }
        else {
            this.updateIndex(0);
            this.animate(0, 0);
        }
        if (this.options.showBullets) {
            this.createBullets();
        }
        if (this.options.loop) {
            this.createClones();
        }
        this.activateBullets();
        this.activateControls();
    };
    Swiper.prototype.cancelRedirect = function (event) {
        var distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
            ? event.changedTouches[0].clientX
            : event.screenX;
        this.traveledDistance = this.firstPointX - distanceEvent;
        if (this.traveledDistance !== 0
            && this.supportEvents.down === Swiper.MOUSE_EVENTS.down) {
            event.preventDefault();
        }
    };
    Swiper.prototype.animate = function (distance, velocity) {
        var translate = "translate3d(" + -1 * distance + "px, 0px, 0px)";
        this.container.style.transform = translate;
        this.container.style.transitionDuration = velocity + "ms";
    };
    Swiper.prototype.createBullets = function () {
        this.bulletsContainer.removeAllChildren();
        var init = 0;
        var end = this.itemsPerPage.length;
        if (this.options.loop) {
            ++init;
            --end;
        }
        for (var i = init; i < end; i++) {
            var bullet = new DOMElement_1.DOMElement('div');
            bullet.addClasses([Swiper.BULLET_CLASS]);
            bullet.render(this.bulletsContainer.getElement());
            bullet.addEvents([{
                    callback: this.changePageByBullet,
                    name: 'click'
                }]);
            bullet.setAttributes([{
                    name: Swiper.BULLET_ATTR,
                    value: i.toString()
                }]);
        }
    };
    Swiper.prototype.activateControls = function () {
        if (this.nextCtrls && this.prevCtrls) {
            if (this.index > 0) {
                DOMUtils_1.DOMUtils.addClassToItems(this.prevCtrls, Swiper.ACTIVE_CTRL_CLASS);
            }
            else {
                DOMUtils_1.DOMUtils.removeClassToItems(this.prevCtrls, Swiper.ACTIVE_CTRL_CLASS);
            }
            if (this.index < this.lastIndexToShow) {
                DOMUtils_1.DOMUtils.addClassToItems(this.nextCtrls, Swiper.ACTIVE_CTRL_CLASS);
            }
            else {
                DOMUtils_1.DOMUtils.removeClassToItems(this.nextCtrls, Swiper.ACTIVE_CTRL_CLASS);
            }
        }
    };
    Swiper.prototype.setControls = function () {
        var swiper = this.swiper.parentNode;
        this.nextCtrls = swiper.querySelectorAll("[" + Swiper.NEXT_CTRL_ATTR + "]");
        this.prevCtrls = swiper.querySelectorAll("[" + Swiper.PREV_CTRL_ATTR + "]");
        for (var i = 0; i < this.nextCtrls.length; i++) {
            this.nextCtrls[i]
                .addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showNext);
        }
        for (var i = 0; i < this.prevCtrls.length; i++) {
            this.prevCtrls[i]
                .addEventListener(Swiper.ACTIVE_EVENT_CTRL, this.showPrev);
        }
    };
    Swiper.prototype.createControls = function () {
        var prevCtrl = new DOMElement_1.DOMElement('div');
        var nextCtrl = new DOMElement_1.DOMElement('div');
        prevCtrl.addClasses(this.options.prevCtrlClasses);
        nextCtrl.addClasses(this.options.nextCtrlClasses);
        nextCtrl.setAttributes([{
                name: Swiper.NEXT_CTRL_ATTR,
                value: ''
            }]);
        prevCtrl.setAttributes([{
                name: Swiper.PREV_CTRL_ATTR,
                value: ''
            }]);
        prevCtrl.render(this.controlsContainer.getElement());
        nextCtrl.render(this.controlsContainer.getElement());
    };
    Swiper.prototype.containerFullWidth = function () {
        return this.container.scrollWidth - this.container.offsetWidth;
    };
    Swiper.prototype.lastToShow = function () {
        var distance = 0;
        var totalItems = this.items.length - 1;
        for (var i = totalItems; i >= 0; i--) {
            var item = this.items[i];
            distance = distance + item.offsetWidth;
            if (distance > this.container.offsetWidth) {
                if (distance < this.container.offsetWidth + totalItems) {
                    return i;
                }
                return i + 1;
            }
        }
        return totalItems;
    };
    Swiper.prototype.showPrev = function () {
        var amountFirstPage = this.itemsPerPage[0];
        if (this.options.loop && this.index === amountFirstPage) {
            this.animate(this.containerFullWidth(), 0);
            this.updateIndex(this.lastIndexToShow);
            this.activateBullets();
            this.activateControls();
            this.showPrev();
            return;
        }
        if (this.index > 0) {
            if (this.options.changePerPage) {
                var page = this.getCurrentPage();
                this.goToPage(page - 1, this.options.animationMs);
            }
            else {
                var newIndex = this.index - 1;
                var currentItem = this.items[newIndex];
                this.updateIndex(newIndex);
                this.animate(currentItem.offsetLeft, this.options.animationMs);
            }
        }
        this.activateBullets();
        this.activateControls();
    };
    Swiper.prototype.showNext = function () {
        var amountLastPage = this.itemsPerPage[this.itemsPerPage.length - 1];
        if (this.options.loop
            && this.index >= (this.items.length - (amountLastPage * 2))) {
            this.animate(0, 0);
            this.updateIndex(0);
            this.activateBullets();
            this.activateControls();
            this.showNext();
            return;
        }
        var newIndex = this.index + 1;
        if (newIndex <= this.lastIndexToShow) {
            if (this.options.changePerPage) {
                var page = this.getCurrentPage();
                this.goToPage(page + 1, this.options.animationMs);
            }
            else {
                this.updateIndex(newIndex);
                if (newIndex < this.lastIndexToShow) {
                    var currentItem = this.items[newIndex];
                    this.animate(currentItem.offsetLeft, this.options.animationMs);
                }
                else {
                    this.animate(this.containerFullWidth(), this.options.animationMs);
                }
            }
        }
        this.activateBullets();
        this.activateControls();
    };
    Swiper.prototype.update = function () {
        this.lastIndexToShow = this.lastToShow();
        this.itemsPerPage = DOMUtils_1.DOMUtils.itemsPerSection(this.items, this.container);
        if (this.index < this.lastIndexToShow) {
            var currentItem = this.items[this.index];
            this.animate(currentItem.offsetLeft, 0);
        }
        else {
            this.updateIndex(this.lastIndexToShow);
            this.animate(this.containerFullWidth(), 0);
        }
        if (this.options.showBullets) {
            this.createBullets();
        }
        if (this.options.loop) {
            this.createClones();
        }
        this.setSwiperWidth();
        this.activateBullets();
        this.activateControls();
    };
    Swiper.prototype.setSwiperWidth = function () {
        var offsetLeft = DOMUtils_1.DOMUtils.getOffsetLeft(this.swiper);
        var scrollBarWidth = DOMUtils_1.DOMUtils.getScrollbarWidth();
        var lateralSpace = offsetLeft * 2;
        var swiperWidth = window.getInnerWidth() - lateralSpace - scrollBarWidth;
        this.swiper.style.width = swiperWidth + "px";
    };
    Swiper.prototype.swipe = function (moveEvent) {
        moveEvent.preventDefault();
        moveEvent.stopPropagation();
        var distanceEvent = (this.supportEvents.move === Swiper.TOUCH_EVENTS.move)
            ? moveEvent.touches[0].clientX
            : moveEvent.screenX;
        var distance = this.firstPointX - distanceEvent + this.initDistance;
        var containerWidth = this.container.offsetWidth;
        var outRange = containerWidth / 100 * Swiper.SWIPE_OUT_PERCENT;
        var minDistance = outRange * -1;
        var maxDistance = outRange + this.containerFullWidth();
        if (distance < minDistance) {
            distance = minDistance;
        }
        else if (distance > maxDistance) {
            distance = maxDistance;
        }
        this.animate(distance, 0);
    };
    Swiper.prototype.actionDown = function (downEvent) {
        var _this = this;
        if (this.supportEvents.down === Swiper.MOUSE_EVENTS.down) {
            downEvent.preventDefault();
        }
        this.firstPointY = (this.supportEvents.down === Swiper.TOUCH_EVENTS.down)
            ? downEvent.touches[0].clientY
            : downEvent.screenY;
        this.firstPointX = (this.supportEvents.down === Swiper.TOUCH_EVENTS.down)
            ? downEvent.touches[0].clientX
            : downEvent.screenX;
        var transform = this.container.style.transform;
        if (transform) {
            transform = transform.split('(')[1];
            transform = transform.split(')')[0];
            transform = transform.split(',')[0];
            transform = transform.replace('-', '');
            transform = transform.replace('px', '');
            this.initDistance = Number(transform);
        }
        else {
            this.initDistance = 0;
        }
        this.swiper.addEventListener(this.supportEvents.move, this.activateSwipe);
        this.swiper.addEventListener(this.supportEvents.up, function () {
            _this.swiper.removeEventListener(_this.supportEvents.move, _this.activateSwipe);
        });
    };
    Swiper.prototype.activateSwipe = function (moveEvent) {
        var distanceY = (this.supportEvents.move === Swiper.TOUCH_EVENTS.move)
            ? moveEvent.touches[0].clientY
            : moveEvent.screenY;
        if (Math.abs(this.firstPointY - distanceY) < 5) {
            this.swiper.addEventListener(this.supportEvents.move, this.swipe);
            this.swiper.addEventListener(this.supportEvents.up, this.actionUp);
            window.addEventListener(this.supportEvents.move, this.swipe);
            window.addEventListener(this.supportEvents.up, this.actionUp);
        }
        this.swiper.removeEventListener(this.supportEvents.move, this.activateSwipe);
    };
    Swiper.prototype.actionUp = function (upEvent) {
        var distanceEvent = (this.supportEvents.up === Swiper.TOUCH_EVENTS.up)
            ? upEvent.changedTouches[0].clientX
            : upEvent.screenX;
        this.traveledDistance = this.firstPointX - distanceEvent;
        var distance = this.traveledDistance + this.initDistance;
        for (var i = 0; i <= this.lastIndexToShow; i++) {
            var item = this.items[i];
            var ajustDistance = (item.offsetWidth * Swiper.SWIPE_PERCENT_ADJUST)
                / 100;
            var minDistance = this.traveledDistance > 0
                ? item.offsetLeft + ajustDistance
                : item.offsetLeft + item.offsetWidth - ajustDistance;
            if (i < this.lastIndexToShow && minDistance > distance) {
                this.animate(item.offsetLeft, this.options.animationMs);
                this.updateIndex(i);
                break;
            }
            else if (i === this.lastIndexToShow) {
                this.animate(this.containerFullWidth(), this.options.animationMs);
                this.updateIndex(this.lastIndexToShow);
            }
        }
        this.activateBullets();
        this.activateControls();
        this.swiper.removeEventListener(this.supportEvents.move, this.swipe);
        this.swiper.removeEventListener(this.supportEvents.up, this.actionUp);
        window.removeEventListener(this.supportEvents.move, this.swipe);
        window.removeEventListener(this.supportEvents.up, this.actionUp);
    };
    Swiper.prototype.activateControlsByIndexes = function (swiper) {
        var thumbsContainer = swiper
            .querySelector("." + Swiper.THUMBNAILS_CONTAINER_CLASS);
        this.thumbnails = thumbsContainer
            .querySelectorAll("." + Swiper.THUMBNAIL_ITEM_CLASS);
        var itemsSize = this.items.length;
        var thumbnailsSize = this.thumbnails.length;
        if (itemsSize === thumbnailsSize) {
            for (var i = 0; i < itemsSize; i++) {
                var thumbnail = this.thumbnails[i];
                var item = this.items[i];
                thumbnail.addEventListener(Swiper.ACTIVE_EVENT, this.showByIndex);
                item.style.width = Swiper.ITEM_MAGNIFY_WIDTH;
            }
        }
        else {
            throw new Error('Error: Thumbnails and Items have different length');
        }
    };
    Swiper.prototype.showByIndex = function (event) {
        var target = event.target;
        var thumbnailsSize = this.thumbnails.length;
        var thumbnail = DOMUtils_1.DOMUtils.findParentElementByClass(target, Swiper.THUMBNAIL_ITEM_CLASS);
        for (var i = 0; i < thumbnailsSize; i++) {
            if (this.thumbnails[i] === thumbnail) {
                var itemToShow = this.items[i];
                this.updateIndex(i);
                this.activateBullets();
                this.activateControls();
                this.animate(itemToShow.offsetLeft, this.options.animationMs);
                break;
            }
        }
    };
    Swiper.prototype.changePageByBullet = function (event) {
        var target = event.target;
        var pageNumber = parseInt(target.getAttribute(Swiper.BULLET_ATTR));
        this.goToPage(pageNumber, this.options.animationMs);
    };
    Swiper.prototype.getCurrentPage = function () {
        var page = 0;
        var itemsPerPage = 0;
        var newIndex = this.index + 1;
        for (var i = 0; i < this.items.length; i++) {
            itemsPerPage = itemsPerPage + this.itemsPerPage[i];
            if (itemsPerPage >= newIndex) {
                page = i;
                break;
            }
        }
        return page;
    };
    Swiper.prototype.goToPage = function (pageNumber, velocity) {
        var itemIndex = 0;
        for (var i = 0; i < pageNumber; i++) {
            itemIndex = itemIndex + this.itemsPerPage[i];
        }
        if (itemIndex + 1 <= this.lastIndexToShow) {
            var lastPageItem = this.items[itemIndex];
            this.animate(lastPageItem.offsetLeft, velocity);
            this.updateIndex(itemIndex);
        }
        else {
            this.animate(this.containerFullWidth(), velocity);
            this.updateIndex(this.lastIndexToShow);
        }
        this.activateBullets();
        this.activateControls();
    };
    Swiper.prototype.activateBullets = function () {
        if (this.options.showBullets) {
            var bullets = this.bulletsContainer.getElement().children;
            var page = this.options.loop
                ? this.getCurrentPage() - 1
                : this.getCurrentPage();
            DOMUtils_1.DOMUtils.removeClassToItems(bullets, 'active');
            if (bullets[page]) {
                DOMUtils_1.DOMUtils.addClass(bullets[page], 'active');
            }
        }
    };
    Swiper.prototype.autoplay = function () {
        var _this = this;
        this.interval = window.setInterval(function () {
            _this.showNext();
        }, this.options.autoplayMs);
    };
    Swiper.prototype.stopAutoplay = function () {
        clearInterval(this.interval);
    };
    Swiper.prototype.createClones = function () {
        var amountFirstPage = this.itemsPerPage[0];
        var amountLastPage = this.itemsPerPage[this.itemsPerPage.length - 1];
        var clons = this.container.querySelectorAll("." + Swiper.CLONED_CLASS);
        for (var i = 0; i < amountFirstPage; i++) {
            var currentItem = this.items[i];
            var clonedItem = currentItem.cloneNode(true);
            DOMUtils_1.DOMUtils.addClass(clonedItem, Swiper.CLONED_CLASS);
            this.container.appendChild(clonedItem);
        }
        var lastItem = this.items.length - 1;
        var lastItemToClone = lastItem - amountLastPage;
        for (var i = lastItem; i > lastItemToClone; i--) {
            var currentItem = this.items[i];
            var clonedItem = currentItem.cloneNode(true);
            DOMUtils_1.DOMUtils.addClass(clonedItem, Swiper.CLONED_CLASS);
            this.container.insertBefore(clonedItem, this.container.firstChild);
        }
        DOMUtils_1.DOMUtils.removeElements(clons);
        this.items = this.container.querySelectorAll("." + Swiper.ITEM_CLASS);
        this.lastIndexToShow = this.lastToShow();
        this.itemsPerPage = DOMUtils_1.DOMUtils.itemsPerSection(this.items, this.container);
        this.activateBullets();
        this.createBullets();
    };
    return Swiper;
}());
Swiper.SWIPER_UID_ATTR = 'data-swiper-uid';
Swiper.CLONED_CLASS = 'clone';
Swiper.ACTIVE_EVENT = 'click';
Swiper.THUMBNAILS_CONTAINER_CLASS = 'thumbnails-container';
Swiper.THUMBNAIL_ITEM_CLASS = 'thumbnail-item';
Swiper.ITEM_MAGNIFY_WIDTH = '100%';
Swiper.SWIPER_CLASS = 'swiper-section';
Swiper.CONTAINER_CLASS = 'swiper-container';
Swiper.ITEM_CLASS = 'swiper-item';
Swiper.ITEM_ACTIVE_CLASS = 'active';
Swiper.CTRLS_CONTAINER_CLASS = 'swiper-controls-container';
Swiper.NEXT_CTRL_ATTR = 'data-swiper-next-control';
Swiper.PREV_CTRL_ATTR = 'data-swiper-prev-control';
Swiper.ACTIVE_CTRL_CLASS = 'active';
Swiper.ACTIVE_EVENT_CTRL = 'click';
Swiper.BULLET_ATTR = 'data-swiper-go-page';
Swiper.BULLET_CLASS = 'swiper-bullet';
Swiper.SWIPE_OUT_PERCENT = 10;
Swiper.SWIPE_PERCENT_ADJUST = 10;
Swiper.WINDOW_EVENT = 'resize';
Swiper.TOUCH_EVENTS = {
    click: 'touchend',
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend'
};
Swiper.MOUSE_EVENTS = {
    click: 'click',
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup'
};
exports.Swiper = Swiper;
//# sourceMappingURL=Swiper.js.map