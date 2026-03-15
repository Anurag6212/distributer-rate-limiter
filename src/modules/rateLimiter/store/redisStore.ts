import { redisClient } from "../../../config/redis";
import { RateLimitStore } from "./rateLimiterStore";

class RedisStore implements RateLimitStore {
  async increment(key: string): Promise<number> {
    const client = redisClient.getClient();
    return await client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    const client = redisClient.getClient();
    await client.expire(key, seconds);
  }

  async get(key: string): Promise<number | null> {
    const client = redisClient.getClient();
    const val = await client.get(key);
    return val ? parseInt(val) : null;
  }

  async set(key: string, value: number, expiry: number): Promise<void> {
    const client = redisClient.getClient();
    await client.set(key, value.toString(), {
      EX: expiry,
    });
  }
}

export default RedisStore;