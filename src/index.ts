import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import { createThreadPool } from 'thread-puddle'
import EventCron from './services/EventCron';
import Routes from "./routes";
import Database from "./db";
import { NETWORK } from "./utils/constants";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    this.startEventCronJob();
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*"
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new Database();
  }

  private async startEventCronJob() {
    // start cron for network
    if (!NETWORK) {
      console.log("Must have a network")
      process.exit(1)
    }
    const eventCron = await EventCron.build(NETWORK);
    await eventCron.startCronForNetwork();

    // const networks = NETWORK.split(',');
    // networks.forEach(async (network) => {
    //   console.log("network ", network);
    //   // use pm2 or worker or https://www.npmjs.com/package/thread-puddle
    //   const eventCronWorker = await createThreadPool<EventCron>('./services/EventCron');
    //   await eventCronWorker.build(network);
      
    //   eventCronWorker.pool.terminate()
    // });
  }
}
