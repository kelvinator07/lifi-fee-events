import { ethers } from 'ethers';
import { contractABI } from '../utils/LIFIContractABI';
import { BlockTag } from '@ethersproject/abstract-provider';
import IParsedFeeCollectedEvents from './IParsedFeeCollectedEvents';
import IChain from './IChain';
import logger from '../utils/logger';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9';
const POLYGON_RPC_URL = process.env.CHAIN_RPC_URL || 'https://polygon-rpc.com';
const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);


export default class Polygon extends IChain {
    async getLatestBlock(): Promise<number> {
        return await provider.getBlockNumber();
    }

    async getBlock(blockNumber: number): Promise<number | null> {
        const block = await provider.getBlock(blockNumber);
        return block ? block.number : null;
    }

    /**
     * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
     * @param fromBlock
     * @param toBlock
     */
    loadFeeCollectorEvents(fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]> {
        logger.info('[loadFeeCollectorEvents] ', fromBlock, toBlock);
        const feeCollector = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
        const filter = feeCollector.filters.FeesCollected();
        return feeCollector.queryFilter(filter, fromBlock, toBlock);
    }

    /**
     * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
     * @param events
    //  */
    parseFeeCollectorEvents(events: ethers.Event[]): IParsedFeeCollectedEvents[] {
        logger.info('[parseFeeCollectorEvents] events length: ', events.length);
        const feeCollectorContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

        return events.map(event => {
            const parsedEvent = feeCollectorContract.interface.parseLog(event);

            const feesCollected: IParsedFeeCollectedEvents = {
                token: parsedEvent.args[0],
                integrator: parsedEvent.args[1],
                integratorFee: parsedEvent.args[2],
                lifiFee: parsedEvent.args[3],
            };
            return feesCollected;
        });
    }
}
