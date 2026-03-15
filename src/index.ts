import express from "express";
import { redisClient } from "./config/redis";
import DemoController from "./modules/demo/demo.controller";

const app = express();

app.use(express.json());

async function start() {
  await redisClient.connect();

  const demoController = new DemoController();

  app.use("/demo", demoController.router);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

start();