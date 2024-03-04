import { IPaginateOptions, IPaginateResult } from "typegoose-cursor-pagination";
import {
    ParsedFeeCollectedEvent,
    ParsedFeeCollectedEventModel,
} from "../models/ParsedFeeCollectedEvent";

import { LastScannedBlock, LastScannedBlockModel } from "../models/LastScannedBlock";
import { START_BLOCK_NUMBER } from "../utils/constants";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface IParsedEventRepository {
    save(event: ParsedFeeCollectedEvent): Promise<ParsedFeeCollectedEvent>;
    retrieveById(id: string): Promise<ParsedFeeCollectedEvent | null>;
    retrieveAll(): Promise<ParsedFeeCollectedEvent[]>;
    retrieveAllByIntegratorAddress(address: string, options: IPaginateOptions): Promise<IPaginateResult<ParsedFeeCollectedEvent>>;
}

class ParsedEventRepository implements IParsedEventRepository {
    async save(parsedEvent: ParsedFeeCollectedEvent): Promise<ParsedFeeCollectedEvent> {
        try {
            return await ParsedFeeCollectedEventModel.create(parsedEvent);
        } catch (err) {
            throw new Error("Failed to create Event!");
        }
    }

    async saveMany(parsedEvents: ParsedFeeCollectedEvent[]): Promise<ParsedFeeCollectedEvent[]> {
        try {
            return await ParsedFeeCollectedEventModel.insertMany(parsedEvents);
        } catch (err) {
            console.log("err ", err);
            throw new Error("Failed to create Event!");
        }
    }

    async retrieveById(id: string): Promise<ParsedFeeCollectedEvent | null> {
        try {
            return await ParsedFeeCollectedEventModel.findById(id);
        } catch (error) {
            throw new Error(`Failed to retrieve Event with id = ${id}`);
        }
    }

    async retrieveAll(): Promise<ParsedFeeCollectedEvent[]> {
        try {
            return await ParsedFeeCollectedEventModel.find();
        } catch (error) {
            throw new Error("Failed to retrieve Events!");
        }
    }

    async retrieveAllByIntegratorAddress(address: string, options: IPaginateOptions): Promise<IPaginateResult<ParsedFeeCollectedEvent>> {
        try {
            const query = { integrator: address, sort: 'desc' }; // sort by created date .sort({ blockNumber: 'desc' })
            return await ParsedFeeCollectedEventModel.findPaged(options, query);
        } catch (error) {
            console.log("error ", error);
            throw new Error("Failed to retrieve Events!");
        }
    }

    async retrieveLastScannedBlock(): Promise<number> {
        try {
            const lastScannedBlock = await LastScannedBlockModel.findOne().sort({ blockNumber: -1 }).limit(1);
            console.log("lastScannedBlock db  ", lastScannedBlock);
            return lastScannedBlock ? lastScannedBlock.blockNumber : START_BLOCK_NUMBER;
        } catch (error) {
            console.log("error ", error);
            throw new Error("Failed to retrieve last scanned block!");
        }
    }

    async saveLastScannedBlock(blockNumber: number): Promise<LastScannedBlock> {
        try {
            return await LastScannedBlockModel.findOneAndUpdate({}, { blockNumber }, { upsert: true, new: true });
        } catch (error) {
            console.log("error ", error);
            throw new Error("Failed to save last scanned block!");
        }
    }
}

export default new ParsedEventRepository();
