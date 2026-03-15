import FixedWindowLimiter from "./algorithms/fixedWindowLimiter"
import SlidingWindowCounterLimiter from "./algorithms/slidingWindowCounterLimiter"
import TokenBucketLimiter from "./algorithms/tokenBucketLimiter"
import { RateLimitPolicy } from "./rateLimiter.types"
import RedisStore from "./store/redisStore"

export default class LimiterFactory {

  private store = new RedisStore()

  create(policy: RateLimitPolicy) {

    switch (policy.algorithm) {

      case "fixed-window":
        return new FixedWindowLimiter(this.store, {
          limit: policy.limit!,
          window: policy.window!
        })

      case "sliding-window":
        return new SlidingWindowCounterLimiter(this.store, {
          limit: policy.limit!,
          window: policy.window!
        })

      case "token-bucket":
        return new TokenBucketLimiter(this.store, {
          capacity: policy.capacity!,
          refillRate: policy.refillRate!
        })

      default:
        throw new Error("Unknown rate limit algorithm")

    }

  }

}