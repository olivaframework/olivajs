import { DOMElement } from './DOMElement';

class LoaderBar {
  private static readonly ACTIVE_CLASS: string = 'loading';
  private static readonly LOADERBAR_CLASS: string = 'loader-bar';
  private static readonly LOADERBAR_ELEMENT: string = 'div';

  private static loaderbar: DOMElement;
  private static instance: LoaderBar = new LoaderBar();

  private static activeRequests;
  private static progress;

  constructor() {
    LoaderBar.activeRequests = 0;
    LoaderBar.progress = 0;

    if (LoaderBar.instance) {
      throw new Error('Error: Use Loader.getInstance() instead of new.');
    }

    document.addEventListener('http-sent', LoaderBar.addRequest);

    document.addEventListener('http-loading', LoaderBar.changeProgress);

    document.addEventListener('http-finished', LoaderBar.removeRequest);

    LoaderBar.loaderbar = new DOMElement(LoaderBar.LOADERBAR_ELEMENT);
    LoaderBar.loaderbar.addClasses([LoaderBar.LOADERBAR_CLASS]);
    LoaderBar.loaderbar.addClasses([LoaderBar.ACTIVE_CLASS]);
    LoaderBar.loaderbar.render(document.body);
  }

  private static addRequest() {
    if (LoaderBar.activeRequests === 0) {
      LoaderBar.show();
    }
    LoaderBar.activeRequests = LoaderBar.activeRequests + 1;
  }

  private static removeRequest() {
    if (LoaderBar.activeRequests === 0) {
      LoaderBar.hide();
      LoaderBar.progress = 0;
    } else {
      LoaderBar.activeRequests = LoaderBar.activeRequests - 1;
    }
  }

  private static show() {
    LoaderBar.loaderbar.addClasses([LoaderBar.ACTIVE_CLASS]);
  }

  private static changeProgress() {
    LoaderBar.progress = LoaderBar.progress
      + ((100 - LoaderBar.progress) / 5);
    LoaderBar.changeWidth(LoaderBar.progress);
  }

  private static changeWidth(width: number) {
    LoaderBar.loaderbar.getElement().style.width = `${ width }%`;
  }

  private static hide() {
    LoaderBar.changeWidth(100);
    LoaderBar.loaderbar.removeClasses([LoaderBar.ACTIVE_CLASS]);
  }

  public static getInstance(): LoaderBar {
    return LoaderBar.instance;
  }
}

export { LoaderBar };
