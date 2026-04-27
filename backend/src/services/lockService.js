import redis from "../config/redisClient.js";

export const acquireLock = async (key, ttlSeconds = 30) => {
  const lockValue = `${Date.now()}-${Math.random()}`;

  const result = await redis.set(key, lockValue, "EX", ttlSeconds, "NX");

  if (result !== "OK") {
    return null;
  }

  return lockValue;
};

export const releaseLock = async (key, lockValue) => {
  const currentValue = await redis.get(key);

  if (currentValue === lockValue) {
    await redis.del(key);
  }
};
