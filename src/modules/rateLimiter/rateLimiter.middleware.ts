import { Request, Response, NextFunction } from "express"
import RateLimiterService from "./rateLimiter.service"
import { RateLimitPolicy } from "./rateLimiter.types"

const rateLimiterService = new RateLimiterService()

export default function RateLimiterMiddleware(policy: RateLimitPolicy) {

  return async function (req: Request, res: Response, next: NextFunction) {

    const key = `rate_limit:${req.ip}`

    const result = await rateLimiterService.check(key, policy)

    if (!result.allowed) {
      return res.status(429).json({
        message: "Too many requests"
      })
    }

    next()

  }

}