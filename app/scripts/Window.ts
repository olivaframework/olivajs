interface Window {
  getInnerHeight: () => number;
  getInnerWidth: () => number;
  isMobile: () => boolean;
  onEvent: (eventName: string, callback: () => void, time: number) => void;
  redirect: (url: string) => void;
  scrollTop: () => number;
  supportTouchEvents: () => boolean;
}

window.getInnerHeight = () => window.innerHeight;

window.getInnerWidth = () => window.innerWidth;

window.isMobile = () => 1280 > Math.max(
  0 || document.documentElement.clientWidth, window.innerWidth
);

window.onEvent = (eventName, callback, time) => {
  let timeout = 0;

  window.addEventListener(eventName, event => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time, event);
  });
};

window.redirect = url => {
  window.location.href = url;
};

window.scrollTop = () => {
  if (window.pageYOffset) {
    return window.pageYOffset;
  }

  return document.body.scrollTop;
};

window.supportTouchEvents = () => 'ontouchstart' in window;
