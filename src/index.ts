import express from "express";
import { redisClient } from "./config/redis";
import DemoController from "./modules/demo/demo.controller";
import { constants } from "./constants";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

async function start() {
  await redisClient.connect();

  const demoController = new DemoController();

  app.use("/demo", demoController.router);

  app.listen(constants.PORT, () => {
    console.log(`Server running on port ${constants.PORT}`);
  });
}

start();