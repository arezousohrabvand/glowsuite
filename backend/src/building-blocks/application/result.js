export class Result {
  constructor(success, value = null, error = null) {
    this.success = success;
    this.value = value;
    this.error = error;
  }

  static ok(value = null) {
    return new Result(true, value, null);
  }

  static fail(error) {
    return new Result(false, null, error);
  }
}
