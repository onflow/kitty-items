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

### 1. Install the Flow CLI

Before you start, install the [Flow command-line interface (CLI)](https://docs.onflow.org/flow-cli).

_⚠️ This project requires `flow-cli v0.15.0` or above._

### 2. Clone the project

```sh
git clone https://github.com/onflow/kitty-items.git
```

### 2.b Initialize the `fcl-dev-wallet` Submodule

If you've already cloned the project, or you're starting fresh, you'll neeed to include the `fcl-dev-wallet`.

```sh
git submidule init && git submodule update
```

This command will clone the `fcl-dev-wallet` as a submodule in your repository. We're including the code as a submodule (and not a package) for the time being, because the wallet is still in early development.
To ensure you have the latest version of the wallet, you can simply run `git submodule update` to fetch the latest code.

### 3. Create `.env` Files

Create `.env.local` in the `web` and `api` folders.

```sh
cd ./web
cp .env.example .env.local
```

```sh
cd ./api
cp .env.example .env.local
```

### 3. Configure Your Environment

Next we'll add important configuration values in 3 files:
  - `flow.json`
  - `web/.env.local`
  - `api/.env.local`

#### Start the Flow Emulator
