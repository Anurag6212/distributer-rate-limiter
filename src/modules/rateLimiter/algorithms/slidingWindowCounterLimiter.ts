import { RateLimiterConfig, RateLimitResult } from "../rateLimiter.types"
import { RateLimitStore } from "../store/rateLimiterStore"

export default class SlidingWindowCounterLimiter {
  constructor(
    private store: RateLimitStore,
    private config: RateLimiterConfig
  ) {}

  async isAllowed(key: string): Promise<RateLimitResult> {
    const now = Math.floor(Date.now() / 1000)
    const window = this.config.window

    const currentWindow = Math.floor(now / window)
    const previousWindow = currentWindow - 1

    const currentKey = `${key}:${currentWindow}`
    const prevKey = `${key}:${previousWindow}`

    const currentCount = await this.store.increment(currentKey)

    if (currentCount === 1) {
      await this.store.expire(currentKey, window * 2)
    }

    const prevCount = (await this.store.get(prevKey)) || 0

    const elapsed = now % window
    const weight = (window - elapsed) / window

    const totalRequests = prevCount * weight + currentCount

    const allowed = totalRequests <= this.config.limit

    return {
      allowed,
      remaining: Math.max(this.config.limit - Math.ceil(totalRequests), 0)
    }
  }
}