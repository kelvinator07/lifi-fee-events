import mongoose from 'mongoose';
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config();

const mongoUrl: string = process.env.MONGO_URI as string;
logger.info(`mongoUrl ${mongoUrl}`);

const mongoSetup = async () => {
    try {
        mongoose.Promise = global.Promise;
        await mongoose.connect(mongoUrl!);
        logger.info('MongoDb Connected');
    } catch (error) {
        logger.error('Error while trying to connect to MongoDb ', error);
        process.exit(1);
    }
};

export default mongoSetup;
