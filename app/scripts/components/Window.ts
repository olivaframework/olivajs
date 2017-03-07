interface Window {
  isMobile: () => boolean;
  supportTouchEvents: () => boolean;
  redirect: (url: string) => void;
  onEvent: (callback: () => void, time: number, eventName: string) => void;
}

window.isMobile = () => 768 > Math.max(
  0 || document.documentElement.clientWidth, window.innerWidth
);

window.redirect = (url: string) => {
  window.location.href = url;
};

window.onEvent = (callback: () => void, time: number, eventName: string) => {
  let timeout = 0;

  window.addEventListener(eventName, event => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time, event);
  });
};

window.supportTouchEvents = () => 'ontouchstart' in window;
