import dotenv from 'dotenv';
dotenv.config();

export const APP_NAME = process.env.APP_NAME || 'lifi-fee-events';
export const START_BLOCK_NUMBER = process.env.START_BLOCK_NUMBER
    ? parseInt(process.env.START_BLOCK_NUMBER, 10)
    : 54197277;
export const PORT = parseInt(process.env.PORT!, 10) || 8080;
export const MONGO_URI = process.env.MONGO_URI!;
export const NETWORK = process.env.NETWORK!;
export const ENVIRONMENT = process.env.NODE_ENV || 'dev';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const CRON_TIMER = process.env.CRON_TIMER || '*/2 * * * * *'; // 2 Seconds
