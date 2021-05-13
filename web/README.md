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
- [Configure and start the API](https://github.com/onflow/kitty-items/tree/master/api#readme)

Add your Testnet Flow address to the environment:

```sh
# Replace this value with your own!
export FLOW_ADDRESS=0xabcdef12345689
```

### 1. Configure your environment

Create a copy of `.env.example`:

```sh
cd ./web

cp .env.example .env.local
```

### 2. Install and run the app!

```sh
npm install       # install dependencies
npm run start:dev # start the web app
```

## Learn more

If you are wanting to learn more about what is happening in here we recommend checking out the [FCL Quick Start Guide](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl#flow-app-quickstart).
In it you will see a lot of overlap of the code in this project.

If you have any questions, comments, or concerns (or just want to say hi!), we would love to have your company in the [Flow Discord server](https://discord.gg/k6cZ7QC).
