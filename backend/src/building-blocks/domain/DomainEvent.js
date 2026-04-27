export class DomainEvent {
  constructor(type, payload = {}) {
    this.type = type;
    this.payload = payload;
    this.occurredAt = new Date();
  }
}
