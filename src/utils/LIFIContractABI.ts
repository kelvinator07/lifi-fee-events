export const contractABI = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_owner',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'batchWithdrawIntegratorFees',
        inputs: [
            {
                name: 'tokenAddresses',
                type: 'address[]',
                internalType: 'address[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'batchWithdrawLifiFees',
        inputs: [
            {
                name: 'tokenAddresses',
                type: 'address[]',
                internalType: 'address[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'cancelOwnershipTransfer',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'collectNativeFees',
        inputs: [
            {
                name: 'integratorFee',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'lifiFee',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'integratorAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'collectTokenFees',
        inputs: [
            {
                name: 'tokenAddress',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'integratorFee',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'lifiFee',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'integratorAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'confirmOwnershipTransfer',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'getLifiTokenBalance',
        inputs: [
            {
                name: 'tokenAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getTokenBalance',
        inputs: [
            {
                name: 'integratorAddress',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'tokenAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'owner',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'pendingOwner',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'transferOwnership',
        inputs: [
            {
                name: '_newOwner',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'withdrawIntegratorFees',
        inputs: [
            {
                name: 'tokenAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'withdrawLifiFees',
        inputs: [
            {
                name: 'tokenAddress',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'FeesCollected',
        inputs: [
            {
                name: '_token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_integrator',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_integratorFee',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: '_lifiFee',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'FeesWithdrawn',
        inputs: [
            {
                name: '_token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_to',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'LiFiFeesWithdrawn',
        inputs: [
            {
                name: '_token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_to',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'OwnershipTransferRequested',
        inputs: [
            {
                name: '_from',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: '_to',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'OwnershipTransferred',
        inputs: [
            {
                name: 'previousOwner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newOwner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'error',
        name: 'InsufficientBalance',
        inputs: [
            {
                name: 'required',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'balance',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
    },
    {
        type: 'error',
        name: 'InvalidAmount',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NativeAssetTransferFailed',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NewOwnerMustNotBeSelf',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NoNullOwner',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NoPendingOwnershipTransfer',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NoTransferToNullAddress',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NotEnoughNativeForFees',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NotPendingOwner',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NullAddrIsNotAnERC20Token',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TransferFailure',
        inputs: [],
    },
    {
        type: 'error',
        name: 'UnAuthorized',
        inputs: [],
    },
] as const;
