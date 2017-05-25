import './Window';

class LineClamp {
  static readonly LINE_CLAMP_CLASS = 'line-clamp-text';

  private element: HTMLElement;
  private maxLines: number;
  private maxLinesMobile: number;
  private elemHeight: number;
  private elementStyles: CSSStyleDeclaration;

  constructor(element: HTMLElement) {
    this.element = element;
    this.maxLines = parseInt(this.element.getAttribute('data-line-clamp'));
    this.maxLinesMobile = parseInt(
      this.element.getAttribute('data-line-clamp-mobile')
    ) || this.maxLines;
    this.elemHeight = this.element.offsetHeight;
    this.elementStyles = window.getComputedStyle(this.element);
    this.update = this.update.bind(this);

    window.onEvent('resize', this.update, 100);
    this.update();
  }

  private update() {
    const maxIterations = 50;
    const lastWord = new RegExp(/\W*\s(\S)*$/);
    const maxLines = window.isMobile() ? this.maxLinesMobile : this.maxLines;
    const lineHeight = parseInt(
      this.elementStyles.getPropertyValue('line-height')
    );
    const maxHeight = maxLines * lineHeight;
    let counter = 0;
    let lastHeight = 0;

    if (this.element.offsetHeight > maxHeight) {
      this.element.classList.add(LineClamp.LINE_CLAMP_CLASS);
    } else {
      this.element.classList.remove(LineClamp.LINE_CLAMP_CLASS);
    }

    while (this.element.offsetHeight > maxHeight && counter < maxIterations) {
      this.element.innerHTML = this.element.innerHTML.replace(lastWord, '');

      if (lastHeight === this.element.offsetHeight) {
        counter++;
      }

      lastHeight = this.element.offsetHeight;

      if (counter === maxIterations - 1) {
        throw (new Error('Too many iterations'));
      }
    }

    this.element.style.height = `${ maxHeight }px`;
  }
}

export { LineClamp };
