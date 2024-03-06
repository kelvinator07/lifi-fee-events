import { IPaginateOptions, IPaginateResult } from 'typegoose-cursor-pagination';
import { FeeCollectedEvent, FeeCollectedEventModel } from '../models/FeeCollectedEvent';

import { LastScannedBlock, LastScannedBlockModel } from '../models/LastScannedBlock';
import { START_BLOCK_NUMBER } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface IEventRepository {
    saveMany(events: FeeCollectedEvent[]): Promise<void>;
    retrieveAll(): Promise<FeeCollectedEvent[]>;
    retrieveAllByIntegratorAddress(
        address: string,
        options: IPaginateOptions
    ): Promise<IPaginateResult<FeeCollectedEvent>>;
    retrieveLastScannedBlock(): Promise<number>;
    saveLastScannedBlock(blockNumber: number): Promise<LastScannedBlock>;
}

class EventRepository implements IEventRepository {
    async saveMany(events: FeeCollectedEvent[]): Promise<void> {
        try {
            await FeeCollectedEventModel.insertMany(events);
        } catch (error) {
            throw new Error('Failed to create Event!');
        }
    }

    async retrieveAll(): Promise<FeeCollectedEvent[]> {
        try {
            return await FeeCollectedEventModel.find();
        } catch (error) {
            throw new Error('Failed to retrieve Events!');
        }
    }

    async retrieveAllByIntegratorAddress(
        address: string,
        options: IPaginateOptions
    ): Promise<IPaginateResult<FeeCollectedEvent>> {
        try {
            const query = { integrator: address };
            return await FeeCollectedEventModel.findPaged(options, query);
        } catch (error) {
            throw new Error('Failed to retrieve Events!');
        }
    }

    async retrieveLastScannedBlock(): Promise<number> {
        try {
            const lastScannedBlock = await LastScannedBlockModel.findOne().sort({ blockNumber: -1 }).limit(1);
            return lastScannedBlock ? lastScannedBlock.blockNumber : START_BLOCK_NUMBER;
        } catch (error) {
            throw new Error('Failed to retrieve last scanned block!');
        }
    }

    async saveLastScannedBlock(blockNumber: number): Promise<LastScannedBlock> {
        try {
            return await LastScannedBlockModel.findOneAndUpdate({}, { blockNumber }, { upsert: true, new: true });
        } catch (error) {
            throw new Error('Failed to save last scanned block!');
        }
    }
}

export default new EventRepository();
