import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import EventCron from './services/EventCron';
import Routes from './routes';
import Database from './db';
import { NETWORK } from './utils/constants';
import logger from './utils/logger';

export default class Server {
    constructor(app: Application) {
        this.config(app);
        this.syncDatabase();
        this.startEventCronJob();
        new Routes(app);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: '*',
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }

    private syncDatabase(): void {
        new Database();
        logger.info('Database started');
    }

    private async startEventCronJob() {
        // start scan for network
        if (!NETWORK) {
            logger.info('Must have a network');
            process.exit(1);
        }
        try {
            const eventCron = await EventCron.build(NETWORK);
            await eventCron.startCronForNetwork();
        } catch(error) {
            logger.info(`Error while starting EventCron for ${NETWORK} : ${error}`);
            process.exit(1);
        }
        

        // TODO: use pm2 or worker or https://www.npmjs.com/package/thread-puddle to create multiple networks on separate threads
    }
}
