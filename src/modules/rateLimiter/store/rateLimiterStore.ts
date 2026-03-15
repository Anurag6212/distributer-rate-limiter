export interface RateLimitStore {
    increment(key: string): Promise<number>
  
    expire(key: string, seconds: number): Promise<void>
  
    get(key: string): Promise<number | null>
  
    set(key: string, value: number, expiry: number): Promise<void>

    executeTokenBucket(
      tokensKey: string,
      lastRefillKey: string,
      capacity: number,
      refillRate: number
    ): Promise<[number, number]>
  }