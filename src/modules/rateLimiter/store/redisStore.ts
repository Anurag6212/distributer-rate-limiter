import { redisClient } from "../../../config/redis"
import { RedisScriptClient } from "../rateLimiter.types"
import { RateLimitStore } from "./rateLimiterStore"
import fs from "fs"
import path from "path"

class RedisStore implements RateLimitStore {

  private scriptSha: string | null = null

  async increment(key: string): Promise<number> {
    const client = redisClient.getClient()
    return client.incr(key)
  }

  async expire(key: string, seconds: number): Promise<void> {
    const client = redisClient.getClient()
    await client.expire(key, seconds)
  }

  async get(key: string): Promise<number | null> {
    const client = redisClient.getClient()
    const val = await client.get(key)
    return val ? parseInt(val) : null
  }

  async set(key: string, value: number, expiry: number): Promise<void> {
    const client = redisClient.getClient()
    await client.set(key, value.toString(), { EX: expiry })
  }

  async executeTokenBucket(
    tokensKey: string,
    lastRefillKey: string,
    capacity: number,
    refillRate: number
  ): Promise<[number, number]> {

    const client = redisClient.getClient()

    const sha = await this.loadLuaScript(client)

    const now = Math.floor(Date.now() / 1000)
    const expiry = 60

    const result = await client.evalSha(
      sha,
      {
        keys: [tokensKey, lastRefillKey],
        arguments: [
          capacity.toString(),
          refillRate.toString(),
          now.toString(),
          expiry.toString()
        ]
      }
    )

    return result as [number, number]

  }

  private async loadLuaScript(client: RedisScriptClient) {

    if (this.scriptSha) return this.scriptSha

    const scriptPath = path.join(
      __dirname,
      "../lua/tokenBucket.lua"
    )

    const script = fs.readFileSync(scriptPath, "utf8")

    this.scriptSha = await client.scriptLoad(script)

    return this.scriptSha

  }

}

export default RedisStore