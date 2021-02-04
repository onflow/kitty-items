![kitty-items-overview](https://user-images.githubusercontent.com/901466/106943245-0eac2b00-66da-11eb-960e-a1db5b1d028d.png)<!-- .element width="100%" -->

# Welcome to the Kitty Items demo application!

### This app was created to help you learn how to build on Flow 

- It demonstrates how to interact with Flow using the Flow client library (**@onflow/fcl**) from different areas of your application.
- It's a **complete smart contract powered NFT marketplace** that showcases how to use Flow's resource-oriented smart contract programming language: Cadence.

Above is a basic diagram of the parts of this project in each folder, and how each part interacts with the others. 

Legend: 

1) The Flow Blockchain
    - The hero of our story. Flow is a next-generation blockchain platform that is designed to be fast and easy to use. If you're new to Flow, consider reading more about it. Read the [Flow Primer](https://www.onflow.org/primer), or go to the [Flow developer documentation](https://docs.onflow.org/) to get some more context before diving into this application.

2) Web App (Static website) [kitty-items-web](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-web)
    - A true Dapp, client-only web app. This is a complete web application built with React that demonstrates how to build a static website that can be deployed to an environment like IPFS and connects directly to the Flow blockchain using `@onflow/fcl`. No servers required. `@onflow/fcl` even handles all of the authentication.

3) Look Ma, a Web Server! [kitty-items-js](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-js)
    - We love decentralization, but servers are still very useful, and this one's no exception. The code in this project demonstrates how to connect to Flow using `@onflow/fcl` from NodeJS environments. It's also chalk-full of handy patterns you'll proabably want to use for more complex and feature-rich blockchain applications, like storing and querying events using a SQL database (Postgres).

4) [kitty-items-cadence](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-cadence)
    - Cadence contracts, scripts & transactions for your viewing pleasure. This folder contains all of the blockchain logic for the marketplace application. 

5) [kitty-items-deployer](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-deployer)
    - Useful utilities for automating development related tasks like bootstrapping accounts and deploying contracts. Look through this project for an idea of what it's like to bootstrap your Flow accounts and Cadence smart contracts onto Flow testnet.

6) An `@onflow/fcl` compatible wallet service that performs authentication and authorization. (Implementation is not a part of this app).


## What are Kitty Items?

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

[kitty-items-deployer][] is a tool that deploys Cadence contracts to the Flow Testnet or Flow Emulator. 
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
