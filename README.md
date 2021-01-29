![kitty-items](https://user-images.githubusercontent.com/37638382/103047804-e0b7c080-4549-11eb-81a3-8abd8cb12809.png)

# What is Kitty Items?

This repository contains Kitty Items, a project that demonstrates the current best practices for building decentralized app (dapps) on Flow.

This project uses [Cadence][cadence], [Flow Client Library](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl) (FCL) and the [Flow JavaScript SDK][flow-js-sdk].

Items are hats for your cats, but under the hood they're non-fungible tokens stored on the Flow blockchain.

Items can be purchased from the marketplace with fungible tokens.
In the future you'll be able to add them to Ethereum CryptoKitties with ownership validated by an oracle.

## Live demo

Check out the [live demo of Kitty Items][kitty-items-demo], deployed on IPFS and the Flow Testnet.

# What's included?

### Cadence Smart Contracts ([kitty-items-cadence][])

[kitty-items-cadence][] contains the source code for the Cadence contracts that power Kitty Items. 
You will find examples of fungible and non-fungible token (NFT) smart contract implementations, 
as well as the scripts and transactions that interact with them.

### Frontend Web App ([kitty-items-web][])

[kitty-items-web][] contains the source code for a frontend application that interacts with the Flow blockchain.
Here you can learn how to:
  - Authenticate Flow accounts in your dapp
  - Sign transactions
  - Query data with FCL scripts

### Backend API ([kitty-items-js][])

[kitty-items-js][] contains the source code for an API that sends transactions to the Flow Blockchain.
Here you can learn how to use the [Flow JavaScript SDK](https://github.com/onflow/flow-js-sdk) 
to build and send both transactions and scripts in a backend setting. 
For this project, this means minting Kibbles (fungible tokens) and Kitty Items (non-fungible tokens).

### Contract Auto-Deployer ([kitty-items-deployer][])

[kitty-items-deployer][] is a tool that deploys Cadence contracts to the Flow Testnet or FLow Emulator. 
Here you will learn how you can deploy your own set of smart contracts.

### Ethereum Oracle (Coming soon!)

- Account linker
- Oracle service

# How do I use this repo?

Welcome to Flow! You can get started by [reading the documentation][flow-docs] and browsing the [Flow community forum][flow-forum].

As a general guideline, it's best to explore Kitty Items in this order:

1. [kitty-items-cadence][] - Learn how to create smart contracts for Flow.
1. [kitty-items-web][] - Learn how a dapp interacts with Flow users, like signing-in and sending transactions.
1. After reading the previous steps, you should have a better understanding on how Cadence works and how to
       interact with the Flow blockchain. The following steps will help you to run your own experiments with Flow by
       creating an account on the testnet and using it to send transactions and deploy contracts.
1. [kitty-items-js][] - How to send transactions to the Flow blockchain with a backend API, as well as reading
       events from the blockchain.
1. [kitty-items-deployer][] - Explore how to deploy contracts to the Flow blockchain.

Fork this repository to make your own dapp or use it as a case study in part of your overall Flow learning experience!

# Questions?

- Chat with the team on the [Flow Discord server][flow-discord]

- Ask questions on the [Flow community forum](https://forum.onflow.org/t/kitty-items-marketplace-demo-dapp/759/5)

# Extra reading 

## Backend API

In [kitty-items-js][] you will find a backend API written in Typescript / Node.js. This backend has a few purposes:

- Demonstrate how the Flow Javascript SDK can be used to send transactions to the Flow blockchain
- Fetch events from the Flow blockchain, process them, and the save the information to a database

In order to accomplish this, there is a RESTful API component and a separate worker service.

In the RESTful API, you will find several routes that send transactions to the blockchain by using the [Flow JavaScript SDK][flow-js-sdk]. 
These transactions are sent by loading a Flow account using a private key from an environment variable.

The worker detects events from the Flow blockchain by running a continuous loop over a set of block ranges. When
it detect an event related to Kitty Items, it then runs some logic that will further process the data, such as
persisting it to a database. In a production setting, it could further augment this data processing by posting a message
to a separate message queue so another more specialized worker could work from the emitted blockchain event.

## Smart Contracts

The KittyItems smart contracts are written in [Cadence][cadence], Flow's resource-oriented programming language.

They are used to manage payment, ownership, and selling of items. To ensure composability with other projects on the
Flow blockchain they are based on existing standards.

### Kibble

Kibble is KittyItems payment token, based on the Flow Fungible Token standard.

### KittyItems

KittyItems are NFTs based on the Flow Non-Fungible Token standard.

### KittyItemsMarket

KittyItemsMarket is a simple first-sale marketplace contract that sells KittyItems in exchange for Kibble.

[kitty-items]: https://github.com/onflow/kitty-items

[kitty-items-js]: https://github.com/onflow/kitty-items/tree/master/kitty-items-js

[kitty-items-web]: https://github.com/onflow/kitty-items/tree/master/kitty-items-web

[kitty-items-cadence]: https://github.com/onflow/kitty-items/tree/master/kitty-items-cadence

[kitty-items-deployer]: https://github.com/onflow/kitty-items/tree/master/kitty-items-deployer

[kitty-items-demo]: https://kitty-items.on.fleek.co

[cadence]: https://github.com/onflow/cadence

[flow-js-sdk]: https://github.com/onflow/flow-js-sdk

[flow-docs]: https://docs.onflow.org/

[flow-discord]: https://discord.gg/xUdZxs82Rz

[flow-forum]: https://forum.onflow.org/
