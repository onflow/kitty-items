# 👋 Welcome to the Kitty Items Demo Application

### This app was created to help you learn how to build on <img height="46px" src="https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg" />

- It demonstrates how to interact with Flow using the Flow client library (**@onflow/fcl**) from different areas of your application.
- It's a **complete smart contract powered NFT marketplace** that showcases how to use Flow's resource-oriented smart contract programming language: [Cadence](https://docs.onflow.org/cadence).


## 🎬 Live demo

### Check out the [live demo of Kitty Items](https://dark-frost-1788.on.fleek.co/), deployed on <a href="https://docs.ipfs.io/concepts/case-study-fleek/"><img height="28px" src="https://docs.ipfs.io/assets/img/logo-fleek.5aed66a3.png" /></a> and the <img height="28px" src="https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg" /> Testnet.
---

# ✨ Get Started

1) ### Create a Flow Testnet account <br/>
To work on this project you'll need to create an account on the Flow Testnet:

- Generate your new Flow account keys using the following command from [Flow CLI](https://docs.onflow.org/flow-cli/): ```flow keys generate``` ⚠️ Make sure to           save these keys in a safe place, you'll need them later.
- Sign up for a Testnet account here: https://testnet-faucet.onflow.org/ by filling out the "Creating an Account" form using the **public key** generated           from the previous step.
- Click "Submit". After a short time, you'll receive an e-mail with your newly created Flow **account address**.
    

2) ### Follow [these instructions](https://github.com/onflow/flow-cli) to install Flow (command-line tools)

## 

<img width="22px" src="https://user-images.githubusercontent.com/674621/71187801-14e60a80-2280-11ea-94c9-e56576f76baf.png" /> Using VSCode? Before cloning this project download and install the [Cadence VSCode Extension](https://github.com/onflow/vscode-flow). 
```
flow cadence install-vscode-extension
```

##

3) ### Clone the project

```
git clone git@github.com:onflow/kitty-items.git
```

Once you have the project files, you'll find setup instructions in the `README.md` files inside each folder. 
The Cadence code is also well commented to help you understand how they function and how to use them. 

4) ### Start by installing [kitty-items-js](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-js/README.md) 
Install this project first. It will help you deploy all of the Cadence contracts, and send transactions to bootstrap the marketplace with Kibble and Kitty Items. You'll find instructions for installing and starting the marketplace [here](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-js/README.md).

## Project Overview

![kitty-items-overview](https://user-images.githubusercontent.com/901466/106943245-0eac2b00-66da-11eb-960e-a1db5b1d028d.png)<!-- .element width="100%" -->


## 🔎 Legend 
Above is a basic diagram of the parts of this project contained in each folder, and how each part interacts with the others.

1) ### The Flow Blockchain
    - The hero of our story. Flow is a next-generation blockchain platform that is designed to be fast and easy to use. If you're new to Flow, consider reading more about it. Read the [Flow Primer](https://www.onflow.org/primer), or visit <a href=""><img src="https://user-images.githubusercontent.com/901466/107085354-3c15d900-67ad-11eb-98f8-1d0e6b02cdd2.png" height="30px" /></a> ([Flow developer documentation](https://docs.onflow.org/)).

2) ### Web App (Static website) | [kitty-items-web](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-web)
    - A true Dapp, client-only web app. This is a complete web application built with React that demonstrates how to build a static website that can be deployed to an environment like IPFS and connects directly to the Flow blockchain using `@onflow/fcl`. No servers required. `@onflow/fcl` handles authentication and authorization of [Flow accounts](https://docs.onflow.org/concepts/accounts-and-keys/), [signing transactions](https://docs.onflow.org/concepts/transaction-signing/), and querying data using using Cadence.

3) ### Look Ma, a Web Server! | [kitty-items-js](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-js)
    - We love decentralization, but servers are still very useful, and this one's no exception. The code in this project demonstrates how to connect to Flow using [Flow JavaScript SDK](https://github.com/onflow/flow-js-sdk) from a NodeJS backend. It's also chalk-full of handy patterns you'll proabably want to use for more complex and feature-rich blockchain applications, like storing and querying events using a SQL database (Postgres). The API demonstrates how to send transactions to the Flow Blockchain, specifically for minting [Kibbles](https://github.com/onflow/kitty-items/blob/mackenzie/updates-readme/kitty-items-cadence/cadence/kibble/contracts/Kibble.cdc) (fungible tokens) and [Kitty Items](https://github.com/onflow/kitty-items/blob/mackenzie/updates-readme/kitty-items-cadence/cadence/kittyItems/contracts/KittyItems.cdc) (non-fungible tokens).

4) ### Cadence Code | [kitty-items-cadence](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-cadence)
    - [Cadence](https://docs.onflow.org/cadence) smart contracts, scripts & transactions for your viewing pleasure. This folder contains all of the blockchain logic for the marketplace application. Here you will find examples of [fungible](https://github.com/onflow/flow-ft) and [non-fungible token (NFT)](https://github.com/onflow/flow-nft) smart contract implementations, as well as the scripts and transactions that interact with them. It also contains examples of how to *test* your Cadence code (tests written in Golang).

5) ### Development Helpers | [kitty-items-deployer](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-deployer)
    - Useful utilities for automating development related tasks like bootstrapping accounts and deploying contracts. Look through this project for an idea of what it's like to bootstrap your Flow accounts and Cadence smart contracts onto the [Flow Emulator](https://github.com/onflow/flow-emulator) or Flow testnet.

6) An `@onflow/fcl` compatible wallet service that helps `@onflw/fcl` perform authentication and authorization of [Flow accounts](https://docs.onflow.org/concepts/accounts-and-keys/).


## 😺 What are Kitty Items?

Items are hats for your cats, but under the hood they're [non-fungible tokens (NFTs)](https://github.com/onflow/flow-nft) stored on the Flow blockchain.

Items can be purchased from the marketplace with fungible tokens.
In the future you'll be able to add them to [Ethereum CryptoKitties](https://www.cryptokitties.co/) with ownership validated by an oracle.


## ❓ More Questions?

- Chat with the team on the [Flow Discord server](https://discord.gg/xUdZxs82Rz)
- Ask questions on the [Flow community forum](https://forum.onflow.org/t/kitty-items-marketplace-demo-dapp/759/5)

---
🚀  Happy Hacking!  

