import { Router, Request, Response } from "express"
import RateLimiterMiddleware from "../rateLimiter/rateLimiter.middleware";

class DemoController {
  public router: Router
  private rateLimiterMiddleware = RateLimiterMiddleware({
    algorithm: "token-bucket",
    capacity: 10,
    refillRate: 1
  });

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get("/", this.rateLimiterMiddleware, this.test)
  }

  private test(req: Request, res: Response) {
    res.json({
      message: "API response",
      time: new Date()
    })
  }
}

export default DemoController