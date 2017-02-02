export class Test {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  public sendMenssage(): string {
    return this.message + ' world';
  }
}
