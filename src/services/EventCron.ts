import { BigNumber, ethers } from "ethers";
import cron from "node-cron";
import dotenv from "dotenv";
import IChain from "../networks/IChain";
import { ParsedFeeCollectedEvent } from "../models/ParsedFeeCollectedEvent";
import parsedEventRepository from "../repositories/event.repository";
import IParsedFeeCollectedEvents from "../networks/IParsedFeeCollectedEvents";
import Polygon from "../networks/Polygon";
import Rootstock from "../networks/Rootstock";

dotenv.config();

// Using console for logging
const logger = console;

// get blocks until null, then use cron job
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
            case "polygon":
                return new Polygon();
            case "rootstock":
                return new Rootstock();
            default:
                throw new Error(`Network ${network} not yet implemented`);
        }
    }

    static async build(network: string) {
        const eventCron = new EventCron(network);
        return eventCron;
    }

    async startCronForNetwork() {
        this.lastScannedBlock = await this.getLastScannedBlock();
        console.log("this.lastScannedBlock ", this.lastScannedBlock);
        this.latestBlock = await this._network.getLatestBlock();
        console.log("this.latestBlock ", this.latestBlock); // 54196523

        for (let startBlock = this.lastScannedBlock; startBlock < this.latestBlock; startBlock++) {
            console.log("startBlock ", startBlock);
            const feeCollectorEvents = await this._network.loadFeeCollectorEvents(
                startBlock,
                startBlock + 1
            );
            logger.log("feeCollectorEvents length ", feeCollectorEvents.length);
            if (feeCollectorEvents.length > 0) {
                logger.log("feeCollectorEvents size ", feeCollectorEvents.length);
                const parsedFeeCollectorEvents =
                    this._network.parseFeeCollectorEvents(feeCollectorEvents);
                    await this.persistToDatabase(parsedFeeCollectorEvents);
            }
            await this.saveLastScannedBlock(startBlock + 1);
        }
        console.log("end of for loop ");
         // update nextBlockToScan for the next 2 blocks
        this.nextBlockToScan = this.latestBlock + 2;

        cron.schedule(process.env.CRON_TIMER!, async () => this.startRealTimeCronJobCheck()).now();
    }

    async startRealTimeCronJobCheck() {
        logger.log("startRealTimeCronJobCheck ");
        // check if next block exists before we proceed
        const nextBlock = await this._network.getBlock(this.nextBlockToScan);
        console.log("nextBlock ", nextBlock);
        if (nextBlock) {
            const feeCollectorEvents = await this._network.loadFeeCollectorEvents(
                this.nextBlockToScan - 1,
                this.nextBlockToScan
            );
            logger.log("feeCollectorEvents length ", feeCollectorEvents.length);
            if (feeCollectorEvents.length > 0) {
                logger.log("feeCollectorEvents size ", feeCollectorEvents.length);
                const parsedFeeCollectorEvents =
                    this._network.parseFeeCollectorEvents(feeCollectorEvents);
                this.persistToDatabase(parsedFeeCollectorEvents);
            }
    
            this.saveLastScannedBlock(this.nextBlockToScan);

            // update nextBlockToScan for the next 2 blocks
            this.nextBlockToScan = this.nextBlockToScan + 2;
        }
    }

    async persistToDatabase(
        parsedFeeCollectorEvents: IParsedFeeCollectedEvents[]
    ) {
        // convert to event model
        const dbDocument = this.parseToDBDocument(parsedFeeCollectorEvents);
        // persist data to database
        const result = await parsedEventRepository.saveMany(dbDocument);
        logger.log("result ", result);
    }

    parseToDBDocument(parsedFeeCollectorEvents: IParsedFeeCollectedEvents[]) {
        return parsedFeeCollectorEvents.map((event) => {
            return {
                token: event.token,
                integrator: event.integrator,
                integratorFee: event.integratorFee.toBigInt(),
                lifiFee: event.lifiFee.toBigInt(),
            } as ParsedFeeCollectedEvent;
        });
    }

    async getLastScannedBlock(): Promise<number> {
        const result = await parsedEventRepository.retrieveLastScannedBlock();
        console.log("result db ", result);
        return result;
    }

    async saveLastScannedBlock(blockNumber: number): Promise<void> {
        const saveLastScannedBlock = await parsedEventRepository.saveLastScannedBlock(blockNumber);
        console.log("saveLastScannedBlock ", saveLastScannedBlock);
    }
}
