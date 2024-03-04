import { BigNumber, ethers } from "ethers";
import { contractABI } from "../utils/LIFIContractABI";
import { BlockTag } from "@ethersproject/abstract-provider";
import IParsedFeeCollectedEvents from "./IParsedFeeCollectedEvents";
import Chain from "./IChain";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9"; // FeesCollected ad default
const POLYGON_RPC_URL = process.env.CHAIN_RPC_URL || "https://polygon-rpc.com"; //Polygon rpc as default
const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL)

// Using console for logging
const logger = console;

export default class Polygon extends Chain {

    async getLatestBlock(): Promise<number> {
        return await provider.getBlockNumber();
    };

    async getBlock(blockNumber: number): Promise<number | null> {
        const block = await provider.getBlock(blockNumber);
        return block ? block.number : null;
    };

    /**
     * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
     * @param fromBlock
     * @param toBlock
     */
    loadFeeCollectorEvents(
        fromBlock: BlockTag,
        toBlock: BlockTag
    ): Promise<ethers.Event[]> {
        logger.log("loadFeeCollectorEvents ", fromBlock, toBlock);
        const feeCollector = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            provider
        );
        const filter = feeCollector.filters.FeesCollected();
        return feeCollector.queryFilter(filter, fromBlock, toBlock);
    }

    /**
     * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
     * @param events
    //  */
    parseFeeCollectorEvents (
        events: ethers.Event[]
    ): IParsedFeeCollectedEvents[] {
        const feeCollectorContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            provider
        );

        return events.map((event) => {
            const parsedEvent = feeCollectorContract.interface.parseLog(event);

            const feesCollected: IParsedFeeCollectedEvents = {
                token: parsedEvent.args[0],
                integrator: parsedEvent.args[1],
                integratorFee: BigNumber.from(parsedEvent.args[2]),
                lifiFee: BigNumber.from(parsedEvent.args[3]),
            };
            return feesCollected;
        });
    };
}
