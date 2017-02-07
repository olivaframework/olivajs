class Test {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  /**
   * @returns {string} The sum of the two numbers.
   */
  public sendMessage(): string {
    return this.message + ' world';
  }
}

export { Test };
