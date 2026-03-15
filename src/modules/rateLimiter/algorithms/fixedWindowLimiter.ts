import { RateLimiterConfig, RateLimitResult } from "../rateLimiter.types"
import { RateLimitStore } from "../store/rateLimiterStore"

export default class FixedWindowLimiter {
  constructor(
    private store: RateLimitStore,
    private config: RateLimiterConfig
  ) {}

  async isAllowed(key: string): Promise<RateLimitResult> {
    const count = await this.store.increment(key)

    if (count === 1) {
      await this.store.expire(key, this.config.window)
    }

    const allowed = count <= this.config.limit

    return {
      allowed,
      remaining: Math.max(this.config.limit - count, 0)
    }
  }
}