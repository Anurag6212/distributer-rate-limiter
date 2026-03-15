export interface RateLimiterConfig {
  limit: number
  window: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

export interface TokenBucketConfig {
  capacity: number
  refillRate: number
}


export type RateLimitAlgorithm =
  | "fixed-window"
  | "sliding-window"
  | "token-bucket"

export interface RateLimitPolicy {
  algorithm: RateLimitAlgorithm
  limit?: number
  window?: number
  capacity?: number
  refillRate?: number
}


export interface RateLimiter {
  isAllowed(key: string): Promise<RateLimitResult>
}