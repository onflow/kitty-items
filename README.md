<p align="center">
    <a href="https://dark-frost-1788.on.fleek.co/">
        <img width="400" src="kitty-items-banner.png" />
    </a>
</p>

👋 Welcome! This demo app was created to help you learn how to build on Flow.

- Kitty Items is a **complete NFT marketplace** built with [Cadence](https://docs.onflow.org/cadence), Flow's resource-oriented smart contract programming language.
- Learn how to deploy contracts, mint NFTs, and integrate user wallets with the Flow Client Library (FCL).

## 🎬 Live Demo

Check out the [live demo of Kitty Items](https://dark-frost-1788.on.fleek.co/),
deployed on [IPFS](https://docs.ipfs.io/concepts/case-study-fleek/) and the Flow Testnet.

## ✨ Getting Started

### 1. Install the Flow CLI

Before you start, install the [Flow command-line interface (CLI)](https://docs.onflow.org/flow-cli).

### 2. Create a Flow Testnet account

You'll need a Testnet account to work on this project. Here's how to make one:

- Generate a new key pair with the Flow CLI: ```flow keys generate``` (_⚠️ Make sure to save these keys in a safe place, you'll need them later._)
- Go to the [Flow Testnet Faucet](https://testnet-faucet-v2.onflow.org/) to create a new account. Use the **public key** from the previous step.
- After a short time, you'll receive an email with your newly-created Flow **account address**.

### 3. Clone the project

```sh
git clone git@github.com:onflow/kitty-items.git
```

Once you have the project files, you'll find setup instructions in the `README.md` files inside each folder.

### 4. Deploy the contracts

Follow the [deployer instructions](https://github.com/onflow/kitty-items/blob/master/kitty-items-deployer) to deploy the Kitty Items Cadence contracts to your Testnet account.

### 5. Run the API

After the contracts are deployed, follow the [kitty-items-js instructions](https://github.com/onflow/kitty-items/tree/master/kitty-items-js)
to install and run the Kitty Items API. This backend service is responsible for initializing accounts, minting NFTs, and processing events.

### 6. Launch the web app

Lastly, follow the [kitty-items-web instructions](https://github.com/onflow/kitty-items/tree/master/kitty-items-web) to launch the Kitty Items front-end React app.

## Project Overview

![kitty-items-overview](https://user-images.githubusercontent.com/901466/106943245-0eac2b00-66da-11eb-960e-a1db5b1d028d.png)<!-- .element width="100%" -->

## 🔎 Legend

Above is a basic diagram of the parts of this project contained in each folder, and how each part interacts with the others.

### 1. The Flow Blockchain

Flow is a next-generation blockchain platform that is designed to be fast and easy to use. If you're new to Flow, consider reading more about it in the [Flow Primer](https://www.onflow.org/primer), or visit the [developer documentation](https://docs.onflow.org/).

### 2. Web App (Static website) | [kitty-items-web](https://github.com/onflow/kitty-items/tree/master/kitty-items-web)

A true dapp, client-only web app. This is a complete web application built with React that demonstrates how to build a static website that can be deployed to an environment like IPFS and connects directly to the Flow blockchain using `@onflow/fcl`. No servers required. `@onflow/fcl` handles authentication and authorization of [Flow accounts](https://docs.onflow.org/concepts/accounts-and-keys/), [signing transactions](https://docs.onflow.org/concepts/transaction-signing/), and querying data using using Cadence scripts.

### 3. Look Ma, a Web Server! | [kitty-items-js](https://github.com/onflow/kitty-items/tree/master/kitty-items-js)

We love decentralization, but servers are still very useful, and this one's no exception. The code in this project demonstrates how to connect to Flow using [Flow JavaScript SDK](https://github.com/onflow/flow-js-sdk) from a NodeJS backend. It's also chalk-full of handy patterns you'll proabably want to use for more complex and feature-rich blockchain applications, like storing and querying events using a SQL database (Postgres). The API demonstrates how to send transactions to the Flow Blockchain, specifically for minting [Kibbles](https://github.com/onflow/kitty-items/blob/master/kitty-items-cadence/contracts/Kibble.cdc) (fungible tokens) and [Kitty Items](https://github.com/onflow/kitty-items/blob/master/kitty-items-cadence/contracts/KittyItems.cdc) (non-fungible tokens).

### 4. Cadence Code | [kitty-items-cadence](https://github.com/onflow/kitty-items/tree/master/kitty-items-cadence)

[Cadence](https://docs.onflow.org/cadence) smart contracts, scripts & transactions for your viewing pleasure. This folder contains all of the blockchain logic for the marketplace application. Here you will find examples of [fungible token](https://github.com/onflow/flow-ft) and [non-fungible token (NFT)](https://github.com/onflow/flow-nft) smart contract implementations, as well as the scripts and transactions that interact with them. It also contains examples of how to *test* your Cadence code (tests written in Golang).

### 5. Development Helpers | [kitty-items-deployer](https://github.com/onflow/kitty-items/tree/master/kitty-items-deployer)

Useful utilities for automating development related tasks like bootstrapping accounts and deploying contracts. Look through this project for an idea of what it's like to bootstrap your Flow accounts and Cadence smart contracts onto the [Flow Emulator](https://github.com/onflow/flow-emulator) or Flow Testnet.

### 6. User Wallet

An `@onflow/fcl` compatible wallet service that helps `@onflw/fcl` perform authentication and authorization of [Flow accounts](https://docs.onflow.org/concepts/accounts-and-keys/).


## 😺 What are Kitty Items?

Items are hats for your cats, but under the hood they're [non-fungible tokens (NFTs)](https://github.com/onflow/flow-nft) stored on the Flow blockchain.

Items can be purchased from the marketplace with fungible tokens.
In the future you'll be able to add them to [Ethereum CryptoKitties](https://www.cryptokitties.co/) with ownership validated by an oracle.


## ❓ More Questions?

- Chat with the team on the [Flow Discord server](https://discord.gg/xUdZxs82Rz)
- Ask questions on the [Flow community forum](https://forum.onflow.org/t/kitty-items-marketplace-demo-dapp/759/5)

---
🚀  Happy Hacking!  

