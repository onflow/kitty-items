![kitty-items](https://user-images.githubusercontent.com/37638382/103047804-e0b7c080-4549-11eb-81a3-8abd8cb12809.png)

# What is Kitty Items

This repository contains Kitty Items, a project that demonstrates current best practice for structuring and writing dapps for deployment to the Flow mainnet using  [Cadence](https://github.com/onflow/cadence), [Flow Client Library](https://github.com/onflow/flow-js-sdk/tree/master/packages/fclhttps://github.com/onflow/flow-js-sdk/tree/master/packages/fcl) (FCL) and Flow [JS](https://github.com/onflow/flow-js-sdk) and Go SDKs.

Items are hats for your cats but underneath the hood they are non-fungible tokens that exist on the Flow blockchain. Items can be purchased in the front-end marketplace with fungible tokens and eventually applied to ethereum CryptoKitties with ownership validation from an oracle.

- [kitty-items](https://github.com/dapperlabs/kitty-items) - Smart contracts & backend services
    - Cadence contracts, transactions, scripts
    - Deploy contracts and send transactions with the js-sdk
    - Get events from Flow
- [kitty-items-web](https://github.com/dapperlabs/kitty-items-web) - front-end react application
    - Authenticate Flow accounts in your dapp
    - Authorization & transaction signing
    - Query data with FCL scripts
- kitty-items-oracle - coming soon:tm:
    - Account linker
    - Oracle service
    
# How to use this repo
1. Fork it and make your own NFT or FT.
2. Use it as a case study/learning experience.
3. Take from it as needed.
4. Play around with our testnet [dApp](https://fancy-water-0426.on.fleek.co/#/wip/qvvg)

## Back End

On [https://github.com/dapperlabs/kitty-items/tree/master/kitty-items-js](https://github.com/dapperlabs/kitty-items/tree/master/kitty-items-js) you will find a backend API written in Typescript / Node.js. This backend has a few purposes:

- Demonstrate how the Flow Javascript SDK can be used to send transactions to the Flow blockchain
- Fetch events from the Flow blockchain and process them such as saving information to a database

In order to accomplish this, we have both a Restful API component as well as a worker.

In the Restful API, you will find several routes that send transactions to the blockchain by using the Flow JS. These transactions are sent by loading a Flow account using a private key from an environment variable.

In the worker, we detect events from the Flow blockchain by running a continuous loop over a set of block ranges. When we detect an event that we’re interested in, we just then run some logic that will further process the data, such as persisting it to a database. In a production setting, we could further augment this data processing by posting a message to a separate message queue so another more specialized worker can work on top of the emitted blockchain event.

## Smart Contracts

The KittyItems smart contracts are written in Cadence, Flow's resource-oriented programming language.

They are used to manage payment, ownership, and selling of items. To ensure composability with other projects on the Flow blockchain they are based on existing standards.

### Kibble

Kibble is KittyItems payment token, based on the Flow Fungible Token standard.

### KittyItems

KittyItems are NFTs based on the Flow Non-Fungible Token standard.

### KittyItemsMarket

KittyItemsMarket is a simple first-sale marketplace contract that sells KittyItems in exchange for Kibble.
