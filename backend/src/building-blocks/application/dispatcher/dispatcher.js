export class Dispatcher {
  constructor() {
    this.handlers = new Map();
  }

  register(name, handler) {
    this.handlers.set(name, handler);
  }

  async dispatch(name, payload) {
    const handler = this.handlers.get(name);

    if (!handler) {
      throw new Error(`No handler registered for ${name}`);
    }

    return handler(payload);
  }
}

export const dispatcher = new Dispatcher();
