export interface RateLimitStore {
    increment(key: string): Promise<number>
  
    expire(key: string, seconds: number): Promise<void>
  
    get(key: string): Promise<number | null>
  
    set(key: string, value: number, expiry: number): Promise<void>
  }