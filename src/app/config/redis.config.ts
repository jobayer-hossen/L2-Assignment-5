/* eslint-disable no-console */
import { createClient } from "redis";
import { envVars } from "./env";

export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    // host: '54.82.91.90',
    family: 4,
    reconnectStrategy: retries => Math.min(retries * 50, 5000),
    port: Number(envVars.REDIS_PORT),
    timeout: 10000,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected..!");
  }
};
