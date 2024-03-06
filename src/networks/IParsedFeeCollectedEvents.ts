import { BigNumber } from 'ethers';

export default interface IParsedFeeCollectedEvents {
    token: string; // the address of the token that was collected
    integrator: string; // the integrator that triggered the fee collection
    integratorFee: BigNumber; // the share collector for the integrator
    lifiFee: BigNumber; // the share collected for lifi
}
