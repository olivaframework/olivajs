class Test {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  sendMessage(): string {
    return this.message + ' world';
  }
}

export { Test };
