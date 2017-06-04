class WindowUtils {
  private static instance: WindowUtils = new WindowUtils();

  constructor() {
    if (WindowUtils.instance) {
      throw new Error('Error: Use WindowUtils.functionName instead of new.');
    }
  }

  static getInnerHeight() {
    return window.innerHeight;
  }

  static getInnerWidth() {
    window.innerWidth;
  }

  static isMobile() {
    const maxWidth = 1280;

    return maxWidth > Math.max(
      0 || document.documentElement.clientWidth, window.innerWidth
    );
  }

  static onEvent(eventName, callback, time) {
    let timeout = 0;

    window.addEventListener(eventName, event => {
      clearTimeout(timeout);
      timeout = window.setTimeout(callback, time, event);
    });
  }

  static redirect(url) {
    window.location.href = url;
  }

  static scrollTop() {
    if (window.pageYOffset) {
      return window.pageYOffset;
    }

    return document.body.scrollTop;
  }

  static supportTouchEvents() {
    return 'ontouchstart' in window;
  }
}

export { WindowUtils };
