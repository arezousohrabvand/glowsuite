export const createSlotHoldDto = (body) => ({
  serviceName: body.serviceName,
  stylistName: body.stylistName,
  date: body.date,
  time: body.time,
});

export const getSlotHoldStatusDto = (params) => ({
  holdId: params.holdId,
});

export const releaseSlotHoldDto = (params) => ({
  holdId: params.holdId,
});
