import { TokenBucketConfig, RateLimitResult } from "../rateLimiter.types"
import { RateLimitStore } from "../store/rateLimiterStore"

export default class TokenBucketLimiter {

  constructor(
    private store: RateLimitStore,
    private config: TokenBucketConfig
  ) {}

  async isAllowed(key: string): Promise<RateLimitResult> {

    const tokensKey = `${key}:tokens`
    const lastRefillKey = `${key}:last_refill`

    const result = await this.store.executeTokenBucket(
      tokensKey,
      lastRefillKey,
      this.config.capacity,
      this.config.refillRate
    )

    const allowed = result[0] === 1
    const remaining = result[1]

    return {
      allowed,
      remaining
    }

  }

}