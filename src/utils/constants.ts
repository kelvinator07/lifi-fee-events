import dotenv from "dotenv";
dotenv.config();

export const APP_NAME = process.env.APP_NAME || "lifi-fee-events";
export const START_BLOCK_NUMBER = process.env.START_BLOCK_NUMBER ? parseInt(process.env.START_BLOCK_NUMBER, 10) : 54197113;
export const PORT = parseInt(process.env.PORT!, 10) || 6000;
export const MONGO_URI = process.env.MONGO_URI!
export const NETWORK = process.env.NETWORK!;
