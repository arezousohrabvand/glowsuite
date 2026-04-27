export class Entity {
  constructor(id) {
    this.id = id;
  }

  equals(entity) {
    if (!entity) return false;
    return this.id?.toString() === entity.id?.toString();
  }
}
