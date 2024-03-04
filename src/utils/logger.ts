import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { APP_NAME } from './constants';

const logDirectory = path.join('log');

const transport = new DailyRotateFile({
    filename: `${APP_NAME}-%DATE%.log`,
    dirname: logDirectory,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '1d'
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [ transport ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console());
}

export default logger;
