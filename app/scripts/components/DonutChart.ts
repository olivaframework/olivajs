class DonutChart {
  static readonly DONUT_CHART_CLASS: string = 'donut-chart-content';
  static readonly LEFT_BAR_CLASS: string = 'donut-chart-fill';
  static readonly RIGHT_BAR_CLASS: string = 'donut-chart-bar';
  static readonly PERCENT: string = 'data-donut-chart-percent';
  static readonly TRANSITION_MS: number = 800;

  public donutChart: HTMLElement;
  public bar: HTMLElement;
  public fill: HTMLElement;
  public percent: number;

  constructor(donutChart: Element) {
    this.donutChart = donutChart
      .querySelector(`.${ DonutChart.DONUT_CHART_CLASS }`) as HTMLElement;
    this.bar = this.donutChart
      .querySelector(`.${ DonutChart.RIGHT_BAR_CLASS }`) as HTMLElement;
    this.fill = this.donutChart
      .querySelector(`.${ DonutChart.LEFT_BAR_CLASS }`) as HTMLElement;

    this.percent = this.validatePercent();
    this.createAnimation();
  }

  public validatePercent(): number {
    const valuePercent = this.donutChart.getAttribute(DonutChart.PERCENT);
    const percent = parseInt(valuePercent);

    if (isNaN(percent)) {
      throw new Error(`Error:
        data-donut-chart-percent="${ valuePercent }" is not a number`
      );
    }

    if (percent < 0) {
      return 0;
    } else if (percent > 100) {
      return 100;
    }

    return percent;
  }

  public animate(element: Element, degree: number): void {
    const bar = element as HTMLElement;

    bar.style.transform = `rotate(${ degree }deg)`;
    bar.style.transitionDuration = `${ DonutChart.TRANSITION_MS }ms`;
  }

  public createAnimation(): void {
    const degree = 360 / 100 * this.percent;

    this.animate(this.bar, degree);

    if (this.percent > 50) {
      setTimeout(() => {
        this.donutChart.style.clip = 'rect(auto, auto, auto, auto)';
        this.fill.style.visibility = 'visible';
      }, DonutChart.TRANSITION_MS / (this.percent / 32.5));
    }
  }
}

export { DonutChart };
