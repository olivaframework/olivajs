interface Window {
  isMobile: () => boolean;
  supportTouchEvents: () => boolean;
  redirect: (url: string) => void;
  onEvent: (eventName: string, callback: () => void, time: number) => void;
  attachEvent(event: string, listener: EventListener): boolean;
  detachEvent(event: string, listener: EventListener): void;
}

window.isMobile = () => 768 > Math.max(
  0 || document.documentElement.clientWidth, window.innerWidth
);

window.redirect = url => {
  window.location.href = url;
};

window.onEvent = (eventName, callback, time) => {
  let timeout = 0;

  window.addEventListener(eventName, event => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time, event);
  });
};

window.supportTouchEvents = () => 'ontouchstart' in window;
