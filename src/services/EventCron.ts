import cron from 'node-cron';
import dotenv from 'dotenv';
import IChain from '../networks/IChain';
import { FeeCollectedEvent } from '../models/FeeCollectedEvent';
import eventRepository from '../repositories/event.repository';
import IParsedFeeCollectedEvents from '../networks/IParsedFeeCollectedEvents';
import Polygon from '../networks/Polygon';
import Solana from '../networks/Solana';
import logger from '../utils/logger';
import { CRON_TIMER, BLOCK_SCAN_LIMIT } from '../utils/constants';

dotenv.config();

export default class EventCron {
    private _network: IChain;
    private lastScannedBlock: number = 0;
    private latestBlock: number = 0;
    private nextBlockToScan: number = 0;

    constructor(network: string) {
        this._network = this.createNetworkClass(network);
    }

    createNetworkClass(network: string): IChain {
        switch (network) {
            case 'polygon':
                return new Polygon();
            case 'solana':
                return new Solana();
            default:
                logger.error(`Network ${network} not yet implemented`);
                throw new Error(`Network ${network} not yet implemented`);
        }
    }

    static async build(network: string) {
        logger.info(`[build] with: ${network}`);
        const eventCron = new EventCron(network);
        return eventCron;
    }

    async startCronForNetwork() {
        logger.info('[startCronForNetwork]');
        this.lastScannedBlock = await this.getLastScannedBlock();
        this.latestBlock = await this._network.getLatestBlock();

        for (let fromBlock = this.lastScannedBlock; fromBlock <= this.latestBlock; fromBlock += BLOCK_SCAN_LIMIT) {
            let toBlock = fromBlock + BLOCK_SCAN_LIMIT;
            if (toBlock > this.latestBlock) {
                toBlock = this.latestBlock;
            }
            const feeCollectorEvents = await this._network.loadFeeCollectorEvents(fromBlock + 1, toBlock);
            logger.info(`[startCronForNetwork] feeCollectorEvents length ${feeCollectorEvents.length} from ${fromBlock + 1} to ${toBlock}`);
            if (feeCollectorEvents.length > 0) {
                const parsedFeeCollectorEvents = this._network.parseFeeCollectorEvents(feeCollectorEvents);
                await this.persistToDatabase(parsedFeeCollectorEvents);
            }
            await this.saveLastScannedBlock(toBlock);
        }

        logger.info(`[startCronForNetwork] Reached latest block ${this.latestBlock}`);

        // update nextBlockToScan for the next 2 blocks
        this.nextBlockToScan = this.latestBlock + 2;

        // Cron job for future blocks
        cron.schedule(CRON_TIMER, async () => this.startRealTimeCronJobCheck()).now();
    }

    async startRealTimeCronJobCheck() {
        logger.info('[startRealTimeCronJobCheck]');
        // check if next block exists before we proceed
        const nextBlock = await this._network.getBlock(this.nextBlockToScan);
        if (nextBlock) {
            const feeCollectorEvents = await this._network.loadFeeCollectorEvents(
                this.nextBlockToScan - 1,
                this.nextBlockToScan
            );
            logger.info(
                `[startRealTimeCronJobCheck] feeCollectorEvents length ${feeCollectorEvents.length} from ${this.nextBlockToScan - 1} to ${this.nextBlockToScan}`
            );
            if (feeCollectorEvents.length > 0) {
                const parsedFeeCollectorEvents = this._network.parseFeeCollectorEvents(feeCollectorEvents);
                await this.persistToDatabase(parsedFeeCollectorEvents);
            }

            await this.saveLastScannedBlock(this.nextBlockToScan);

            // update nextBlockToScan for the next 2 blocks
            this.nextBlockToScan = this.nextBlockToScan + 2;
        }
    }

    async persistToDatabase(parsedFeeCollectorEvents: IParsedFeeCollectedEvents[]) {
        const dbDocument = this.parseToDBDocument(parsedFeeCollectorEvents);
        await eventRepository.saveMany(dbDocument);
    }

    parseToDBDocument(parsedFeeCollectorEvents: IParsedFeeCollectedEvents[]): FeeCollectedEvent[] {
        return parsedFeeCollectorEvents.map(event => {
            return {
                token: event.token,
                integrator: event.integrator,
                integratorFee: event.integratorFee.toString(),
                lifiFee: event.lifiFee.toString(),
            } as FeeCollectedEvent;
        });
    }

    async getLastScannedBlock(): Promise<number> {
        const result = await eventRepository.retrieveLastScannedBlock();
        return result;
    }

    async saveLastScannedBlock(blockNumber: number): Promise<void> {
        await eventRepository.saveLastScannedBlock(blockNumber);
    }
}
