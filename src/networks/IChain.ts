import { ethers } from "ethers";
import { BlockTag } from "@ethersproject/abstract-provider";
import IParsedFeeCollectedEvents from "./IParsedFeeCollectedEvents";

export default abstract class IChain {
    abstract loadFeeCollectorEvents(fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]>;
    abstract parseFeeCollectorEvents(events: ethers.Event[]): IParsedFeeCollectedEvents[];
    abstract getLatestBlock(): Promise<number>;
    abstract getBlock(blockNumber: number): Promise<number | null>;
}
