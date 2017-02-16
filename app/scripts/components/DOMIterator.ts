class DOMIterator {
  private items: NodeListOf<Element>;

  constructor(query: string) {
    this.items = document.querySelectorAll(query);
  }

  public syncForEach(callback): void {
    for (let i = 0; i < this.items.length; i++) {
      callback(this.items[i]);
    }
  }
}

export { DOMIterator };
