import RedisStore from "./store/redisStore"
import FixedWindowLimiter from "./algorithms/fixedWindowLimiter"
import SlidingWindowCounterLimiter from "./algorithms/slidingWindowCounterLimiter"

export default class RateLimiterService {
  private limiter

  constructor() {
    const store = new RedisStore()

    const config = {
      limit: 10,
      window: 60
    }

    this.limiter = new SlidingWindowCounterLimiter(store, config)

    // this.limiter = new FixedWindowLimiter(store, config)
  }

  async check(key: string) {
    return this.limiter.isAllowed(key)
  }
}