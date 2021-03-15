# Kitty Items Web

- An example application built to use the Flow blockchain.
- The majority of its features are directly powered by on-chain contracts.

You can see a working demo of this app at 
[https://dark-frost-1788.on.fleek.co/](https://dark-frost-1788.on.fleek.co/).
It is hosted on IPFS via [https://fleek.co/](https://fleek.co/).

## Run locally against Flow Testnet

### Prerequisites

You'll need to complete the following steps before launching this app:

- [Deploy the Kitty Items contracts](https://github.com/onflow/kitty-items/tree/master/#4-deploy-the-contracts)
- [Configure and start the API](https://github.com/onflow/kitty-items/tree/master/api)

### 1. Configure your environment

Create a copy of `.env.example`:

```sh
cd ./web

cp .env.example .env.local
```

Open `.env.local` and replace the following placeholders with your Testnet address:

```
REACT_APP_CONTRACT_KIBBLE={YOUR_TESTNET_ADDRESS}
REACT_APP_CONTRACT_KITTY_ITEMS={YOUR_TESTNET_ADDRESS}
REACT_APP_CONTRACT_KITTY_ITEMS_MARKET={YOUR_TESTNET_ADDRESS}
```

### 2. Install and run the app!

```sh
npm install       # install the dependencies from the lock file
npm run start:dev # start up the web app
```

## Learn more

If you are wanting to learn more about what is happening in here we recommend checking out the [FCL Quick Start Guide](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl#flow-app-quickstart).
In it you will see a lot of overlap of the code in this project.

If you have any questions, comments, or concerns (or just want to say hi!), we would love to have your company in the [Flow Discord server](https://discord.gg/k6cZ7QC).
