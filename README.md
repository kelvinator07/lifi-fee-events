# LIFI Fee Events

This application starts by getting the `latestBlock` and the `lastScannedBlock` for the network specified, then start scanning for the `FeeCollector` event for every x amount of blocks, i.e if latestBlock is 55,000, scan from the lastScannedBlock to the `blockScanLimit(1000)`, then the next 1000 blocks and so on until the latestBlock 55,000. Then it starts a cron job that runs every 5 seconds to keep sanning the network.

The lastScannedBlock, blockScanLimit and cron job time are all configurable.

## Project setup

```
npm install
```

### Run

#### Start the mongodb database

```
make mongodb
```

#### Start the node application

```
make server
```

## Set up a new network
The application is preconfigured with Polygon network

To run the app for a new network, simply update the `.env` and add the following configs for a specific network:

BLOCK_SCAN_LIMIT=???  # Max is 3000

START_BLOCK_NUMBER=???

NETWORK=???

NETWORK_CHAIN_RPC_URL=https://???

NETWORK_CONTRACT_ADDRESS=???

Then navigate to `src/networks`, add a new class using the network name, then extend `IChain interface` for the necessary methods

## Using docker compose
```
make docker
```
