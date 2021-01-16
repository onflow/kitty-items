![kitty-items](https://user-images.githubusercontent.com/37638382/103047804-e0b7c080-4549-11eb-81a3-8abd8cb12809.png)

# What is Kitty Items

This repository contains Kitty Items, a project that demonstrates current best practice for structuring and writing
dapps for deployment to the Flow mainnet using  [Cadence](https://github.com/onflow/cadence)
, [Flow Client Library](https://github.com/onflow/flow-js-sdk/tree/master/packages/fclhttps://github.com/onflow/flow-js-sdk/tree/master/packages/fcl) (
FCL) and Flow [JS](https://github.com/onflow/flow-js-sdk) SDK.

Items are hats for your cats but underneath the hood they are non-fungible tokens that exist on the Flow blockchain.
Items can be purchased in the front-end marketplace with fungible tokens and eventually applied to ethereum
CryptoKitties with ownership validation from an oracle.

[Demo][dApp]

The project is composed of:

- [kitty-items-cadence][] - Smart contracts & backend services
    - Source code for Cadence contracts. In this repo you will find out how to create Fungible and Non Fungible Smart
      Contract implementations, as well as sending scripts and transactions to interact with them.
- [kitty-items-deployer][] - Smart Contract deployer
    - Source Code for a job that deploys Cadence contracts to the Flow Testnet / Emulator. Here you will learn how you
      can deploy your own set of Smart Contracts.
- [kitty-items-js][] - Backend API
    - Source code for an API that sends transactions to the Flow Blockchain. Here you can learn how to use the Flow JS
      SDK to build and send transactions and scripts in a backend setting. For this project, this means minting
      Kibbles (fungible tokens) and Kitty Items (non-fungible tokens).
- [kitty-items-web][] - Front-end React application
    - Source code for a Front-end application that allows you to interact with the Flow blockchain. Here you will learn
      how to:
        - Authenticate Flow accounts in your dapp
        - Authorization & transaction signing
        - Query data with FCL scripts
- kitty-items-oracle - coming soon:tm:
    - Account linker
    - Oracle service

# How to use this repo

- If you are new to Flow, welcome! You can get started by reading our documentation at [Flow Docs][] and
  on [Flow Forum][].

- As a general guideline, we suggest that you explore Kitty Items by following this order:
    1. [kitty-items-cadence][] - How to create smart contracts for Flow.
    1. [kitty-items-web][] - How Flow interacts with users, like signing-in and sending transactions.
    1. After reading on the previous steps, you should have a better understanding on how Cadence works and how to
       interact with the Flow blockchain. The following steps will help you to run your own experiments with Flow by
       creating an account on the testnet and using it to send transactions and deploy contracts.
    1. [kitty-items-js][] - How to send transactions to the Flow blockchain with a backend API, as well as reading
       events from the blockchain.
    1. [kitty-items-deployer][] - Explore how to deploy contracts to the Flow blockchain.

- Fork it and make your own NFT or FT. Use it as a case study/learning experience!

# Questions?

1. Join discord: https://discord.gg/xUdZxs82Rz

## Back End

On [kitty-items-js][] you will find a backend API written in Typescript / Node.js. This backend has a few purposes:

- Demonstrate how the Flow Javascript SDK can be used to send transactions to the Flow blockchain
- Fetch events from the Flow blockchain and process them such as saving information to a database

In order to accomplish this, we have both a Restful API component as well as a worker.

In the Restful API, you will find several routes that send transactions to the blockchain by using the Flow JS. These
transactions are sent by loading a Flow account using a private key from an environment variable.

In the worker, we detect events from the Flow blockchain by running a continuous loop over a set of block ranges. When
we detect an event that we’re interested in, we just then run some logic that will further process the data, such as
persisting it to a database. In a production setting, we could further augment this data processing by posting a message
to a separate message queue so another more specialized worker can work on top of the emitted blockchain event.

## Smart Contracts

The KittyItems smart contracts are written in Cadence, Flow's resource-oriented programming language.

They are used to manage payment, ownership, and selling of items. To ensure composability with other projects on the
Flow blockchain they are based on existing standards.

### Kibble

Kibble is KittyItems payment token, based on the Flow Fungible Token standard.

### KittyItems

KittyItems are NFTs based on the Flow Non-Fungible Token standard.

### KittyItemsMarket

KittyItemsMarket is a simple first-sale marketplace contract that sells KittyItems in exchange for Kibble.


[kitty-items]: https://github.com/onflow/kitty-items/tree/master/kitty-items-web

[kitty-items-js]: https://github.com/onflow/kitty-items/tree/master/kitty-items-js

[kitty-items-cadence]: https://github.com/onflow/kitty-items/tree/master/kitty-items-cadence

[kitty-items-deployer]: https://github.com/onflow/kitty-items/tree/master/kitty-items-deployer

[kitty-items-web]: https://github.com/onflow/kitty-items-web

[dApp]: https://kitty-items.on.fleek.co

[Flow Docs]: https://docs.onflow.org/

[Flow Forum]: https://forum.onflow.org/
