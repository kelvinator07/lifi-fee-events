import { ConnectOptions } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl: string = process.env.MONGO_URI as string;
console.log("mongoUrl ", mongoUrl);

const mongoSetup = async () => {
    try {
        mongoose.Promise = global.Promise;
        await mongoose.connect(mongoUrl!);
        console.log("MongoDb Connected");
    } catch (error) {
        console.error("Error while trying to connect to MongoDb ", error);
        process.exit(1);
    }
};

export default mongoSetup;
