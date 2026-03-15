import { createClient } from "redis";
import { constants } from "../constants";

export class RedisClient {
  private client = createClient({
    url: constants.REDIS_URL,
  });

  constructor() {
    this.client.on("error", (err) => {
      console.error("Redis Error:", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("Redis connected");
    }
  }

  getClient() {
    if (!this.client.isOpen) {
      throw new Error("Redis client not connected");
    }

    return this.client;
  }
}

// Shared Redis client instance used across the application
export const redisClient = new RedisClient();

export default RedisClient;
