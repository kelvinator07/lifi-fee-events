import { BigNumber, ethers } from "ethers";
import { contractABI } from "../utils/LIFIContractABI";
import { BlockTag } from "@ethersproject/abstract-provider";
import IParsedFeeCollectedEvents from "./IParsedFeeCollectedEvents";
import IChain from "./IChain";


const SOLANA_CONTRACT_ADDRESS = process.env.SOLANA_CONTRACT_ADDRESS || "0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://solana-rpc.com";
const provider = new ethers.providers.JsonRpcProvider(SOLANA_RPC_URL)

export default class Solana extends IChain {

    async getBlock(blockNumber: number): Promise<number | null> {
        const block = await provider.getBlock(blockNumber);
        return block ? block.number : null;
    };

    async getLatestBlock(): Promise<number> {
        return await provider.getBlockNumber();
    };

    /**
     * For a given block range all `FeesCollected` events are loaded from the Solana FeeCollector
     * @param fromBlock
     * @param toBlock
     */
    loadFeeCollectorEvents(
        fromBlock: BlockTag,
        toBlock: BlockTag
    ): Promise<ethers.Event[]> {
        const feeCollector = new ethers.Contract(
            SOLANA_CONTRACT_ADDRESS,
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
            SOLANA_RPC_URL,
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
