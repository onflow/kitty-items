# Kitty Items - Local Development 

## Introduction
We chose to connect Kitty Items to Flow's testnet because we wanted users to see how easy it was to take a non-trivial application to a live Flow network.

Of course, some users may want to expreiment with their smart contracts before deploying them, or otherwise prototype their appliccation before publishing it.
In this section we'll detial how to set up your local environment for dapp development on Flow.

## Tools you'll use
Local development on Flow is made possible using the following tools.

- The `flow-cli`
  - We'll use the Flow command-line interface (`flow-cli`) to create accounts and bootstrap our contracts onto the Flow emulator.
  - Read more: TODO LINK
- The Flow Emulator
  - The Flow Emulator is a Flow blockchain that you can run locally. It has all the features and functionality of the live network because it uses the same software to process transactions and execute code as Flow's execution nodes. (Note: At the moment the emulator can't / does not reflect the state of the live network)
  - Read more: TODO LINK
- The `fcl-dev-wallet`
  - The dev wallet uses the same protocols required by `fcl` and Flow that are being used in production in consumer Flow wallets, such as Blocto.
  - Read more: TODO LINK

## Getting Started


