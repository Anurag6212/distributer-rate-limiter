import { Request, Response, NextFunction } from "express"
import RateLimiterService from "./rateLimiter.service"

export default class RateLimiterMiddleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const key = `rate_limit:${req.ip}`

    const rateLimiterService = new RateLimiterService();

    const result = await rateLimiterService.check(key)

    if (!result.allowed) {
      return res.status(429).json({
        message: "Too many requests"
      })
    }

    next()
  }
}