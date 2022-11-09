export class WppError extends Error {

   errors?: any;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
