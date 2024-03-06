# LIFI Fee Events

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

START_BLOCK_NUMBER=???
NETWORK="???"
NETWORK_CHAIN_RPC_URL="https://???"
NETWORK_CONTRACT_ADDRESS="???"

Then navigate to `src/networks`, add a new class using the network name, then extend `IChain interface` for the necessary methods

## Using docker compose
```
make docker
```
