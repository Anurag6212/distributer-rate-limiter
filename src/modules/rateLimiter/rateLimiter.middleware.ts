import { Request, Response, NextFunction } from "express"
import RateLimiterService from "./rateLimiter.service"
import { RateLimitPolicy } from "./rateLimiter.types"

const rateLimiterService = new RateLimiterService()

export default function RateLimiterMiddleware(policy: RateLimitPolicy) {

  return async function (req: Request, res: Response, next: NextFunction) {

    const ip = req.ip || req.socket.remoteAddress || "unknown"

    const key = `rate_limit:${ip}`

    const result = await rateLimiterService.check(key, policy)

    res.setHeader("X-RateLimit-Limit", policy.capacity?.toString() || "0")
    res.setHeader("X-RateLimit-Remaining", result.remaining)
    res.setHeader("X-Server-Instance", process.env.PORT || "unknown")

    if (!result.allowed) {
      return res.status(429).json({
        message: "Too many requests"
      })
    }

    next()

  }

}