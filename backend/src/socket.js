let ioInstance = null;

export function setIo(io) {
  ioInstance = io;
}

export function getIo() {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
}

export function emitClassSeatUpdate(classId, payload) {
  if (!ioInstance) return;
  ioInstance.to(`class:${classId}`).emit("class-seat-update", payload);
}
