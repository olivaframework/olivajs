interface CounterOptions {
  activateOnLoad: boolean;
  animationMs: number;
  animationType: string;
}

class Counter {
  static readonly UID_ATTR = 'data-counter-uid';
  static readonly ATTR_MIN = 'data-counter-min';
  static readonly ATTR_MAX = 'data-counter-max';

  private element: HTMLElement;
  private min: number;
  private max: number;
  private uid: string;
  private isActivated: boolean;
  private animationMs: number;
  private options: CounterOptions;

  constructor(element: HTMLElement, options: CounterOptions) {
    this.element = element;
    this.options = options;
    this.animate = this.animate.bind(this);

    this.uid = `counter-${ new Date().valueOf().toString() }`;
    this.min = parseInt(this.element.getAttribute(Counter.ATTR_MIN));
    this.max = parseInt(this.element.getAttribute(Counter.ATTR_MAX));

    this.element.setAttribute(Counter.UID_ATTR, this.uid);
    this.element.addEventListener(this.uid, this.animate);

    this.animationMs = (this.options.animationMs > 0)
      ? this.options.animationMs
      : 0;

    if (this.options.activateOnLoad) {
      this.animate();
    }
  }

  private animate(): void {
    if (!this.isActivated) {
      this.isActivated = true;
      this.increment();
    }
  }

  private easeIn(counter):number {
    const time = counter / this.max;

    return -this.animationMs * time * (time - 2);
  }

  private easeOut(counter): number {
    const time = counter / this.max;

    return this.animationMs * time * time;
  }

  private easeInOut(counter): number {
    let time = counter / this.max;

    if ((time / 2) < 1) {
      return this.animationMs / 2 * time * time;
    }

    return -this.animationMs / 2 * (((--time) * (time - 2)) - 1);
  }

  private increment(): void {
    for (let i = this.min; i <= this.max; i++) {
      let durationTime = 0;

      if (this.options.animationType === 'ease-in') {
        durationTime = this.easeIn(i);
      } else if (this.options.animationType === 'ease-out') {
        durationTime = this.easeOut(i);
      } else if (this.options.animationType === 'ease-in-out') {
        durationTime = this.easeInOut(i);
      }

      setTimeout(() => {
        this.element.textContent = i.toString();
      }, durationTime);
    }
  }
}

export { Counter };
