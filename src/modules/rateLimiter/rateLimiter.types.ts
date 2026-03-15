export interface RateLimiterConfig {
    limit: number
    window: number
  }
  
  export interface RateLimitResult {
    allowed: boolean
    remaining: number
  }