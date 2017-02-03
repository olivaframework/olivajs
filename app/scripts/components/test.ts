export class Test {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  public sendMessage(): string {
    return this.message + ' world';
  }
}
