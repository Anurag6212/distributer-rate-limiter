import LimiterFactory from "./rateLimiter.factory"
import { RateLimitPolicy } from "./rateLimiter.types"

export default class RateLimiterService {

  private factory = new LimiterFactory()

  async check(key: string, policy: RateLimitPolicy) {

    const limiter = this.factory.create(policy)

    return limiter.isAllowed(key)

  }

}