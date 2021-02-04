![kitty-items-overview](https://user-images.githubusercontent.com/901466/106943245-0eac2b00-66da-11eb-960e-a1db5b1d028d.png)<!-- .element width="100%" -->

# Welcome to the Kitty Items demo application!

### This app was created to help you learn how to build on Flow 

- It demonstrates how to interact with Flow using the Flow client library (**@onflow/fcl**) from different areas of your application.
- It's a **complete smart contract powered NFT marketplace** that showcases how to use Flow's resource-oriented smart contract programming language: Cadence.

Above is a basic diagram of the parts of this project in each folder, and how each part interacts with the others. 

Legend: 

1) ### The Flow Blockchain
    - The hero of our story. Flow is a next-generation blockchain platform that is designed to be fast and easy to use. If you're new to Flow, consider reading more about it. Read the [Flow Primer](https://www.onflow.org/primer), or go to the [Flow developer documentation](https://docs.onflow.org/) to get some more context before diving into this application.

2) ### Web App (Static website) [kitty-items-web](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-web)
    - A true Dapp, client-only web app. This is a complete web application built with React that demonstrates how to build a static website that can be deployed to an environment like IPFS and connects directly to the Flow blockchain using `@onflow/fcl`. No servers required. `@onflow/fcl` handles authentication of Flow accounts, signing transactions, and querying data using using Cadence.

3) ### Look Ma, a Web Server! [kitty-items-js](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-js)
    - We love decentralization, but servers are still very useful, and this one's no exception. The code in this project demonstrates how to connect to Flow using [Flow JavaScript SDK](https://github.com/onflow/flow-js-sdk) from a NodeJS backend. It's also chalk-full of handy patterns you'll proabably want to use for more complex and feature-rich blockchain applications, like storing and querying events using a SQL database (Postgres). The API demonstrates how to send transactions to the Flow Blockchain, specifically for minting Kibbles (fungible tokens usd in this app) and Kitty Items (non-fungible tokens used in this app).

4) ### Cadence Code [kitty-items-cadence](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-cadence)
    - Cadence smart contracts, scripts & transactions for your viewing pleasure. This folder contains all of the blockchain logic for the marketplace application. Here you will find examples of [fungible](https://github.com/onflow/flow-ft) and [non-fungible token (NFT)](https://github.com/onflow/flow-nft) smart contract implementations, as well as the scripts and transactions that interact with them. 

5) ### [kitty-items-deployer](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-deployer)
    - Useful utilities for automating development related tasks like bootstrapping accounts and deploying contracts. Look through this project for an idea of what it's like to bootstrap your Flow accounts and Cadence smart contracts onto the [Flow Emulator](https://github.com/onflow/flow-emulator) or Flow testnet.

6) An `@onflow/fcl` compatible wallet service that performs authentication and authorization. (Implementation is not a part of this app).


## What are Kitty Items?

Items are hats for your cats, but under the hood they're non-fungible tokens stored on the Flow blockchain.

Items can be purchased from the marketplace with fungible tokens.
In the future you'll be able to add them to Ethereum CryptoKitties with ownership validated by an oracle.

## Live demo

#### Check out the [live demo of Kitty Items](https://kitty-items.on.fleek.co/#/), deployed on IPFS and the Flow Testnet.


## How do I use this repo?

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

## Questions?

- Chat with the team on the [Flow Discord server][flow-discord]

- Ask questions on the [Flow community forum](https://forum.onflow.org/t/kitty-items-marketplace-demo-dapp/759/5)

## Useful Links

[kitty-items-demo](https://kitty-items.on.fleek.co)
[cadence](https://github.com/onflow/cadence)
[flow-js-sdk](https://github.com/onflow/flow-js-sdk)
[flow-docs](https://docs.onflow.org/)
[flow-discord](https://discord.gg/xUdZxs82Rz)
[flow-forum](https://forum.onflow.org/)
