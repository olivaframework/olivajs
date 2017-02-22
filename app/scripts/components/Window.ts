interface Window {
  isMobile: () => boolean;
  redirect: (url: string) => void;
  onResize: (callback: () => void, time: number) => void;
}

window.isMobile = () => 768 > Math.max(
  0 || document.documentElement.clientWidth, window.innerWidth
);

window.redirect = (url: string) => {
  window.location.href = url;
};

window.onResize = (callback: () => void, time: number) => {
  let timeout = 0;

  window.addEventListener('resize', event => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time, event);
  });
};
