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

    const now = Math.floor(Date.now() / 1000)

    let tokens = await this.store.get(tokensKey)
    let lastRefill = await this.store.get(lastRefillKey)

    if (tokens === null || lastRefill === null) {

      tokens = this.config.capacity
      lastRefill = now

    }

    const elapsed = now - lastRefill
    const refill = elapsed * this.config.refillRate

    tokens = Math.min(
      this.config.capacity,
      tokens + refill
    )

    if (tokens < 1) {

      return {
        allowed: false,
        remaining: 0
      }

    }

    tokens -= 1

    await this.store.set(tokensKey, tokens, 60)
    await this.store.set(lastRefillKey, now, 60)

    return {
      allowed: true,
      remaining: tokens
    }

  }

}