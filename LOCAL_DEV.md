# 😺 Kitty Items - Local Development 👩‍💻

## 👋 Introduction
We chose to connect Kitty Items to Flow's testnet because we wanted users to see how easy it was to take a non-trivial application to a live Flow network.

Of course, some users may want to experiment with their smart contracts before deploying them, or otherwise prototype their application before publishing it.
In this section we'll detail how to set up your local environment for dapp development on Flow.

## 🛠 Tools you'll use
Local development on Flow is made possible using the following tools:

- The `flow-cli`
  - We'll use the Flow command-line interface (`flow-cli`) to create accounts and bootstrap our contracts onto the Flow emulator.
  - `flow-cli` [documentation](https://docs.onflow.org/flow-cli)
- The Flow Emulator
  - The Flow Emulator is a Flow blockchain that you can run locally. It has all the features and functionality of the live network because it uses the same software to process transactions and execute code as Flow's execution nodes. (Note: At the moment the emulator can't / does not reflect the state of the live network)
  - Flow emulator [documentation](https://docs.onflow.org/emulator)
- The `fcl-dev-wallet`
  - The dev wallet uses the same protocols required by `fcl` and Flow that are being used in production in consumer Flow wallets, such as Blocto.
  - `fcl-dev-wallet` [documentation](https://github.com/onflow/fcl-dev-wallet)

## ✨ Getting Started

### 1. Install the Flow CLI

Before you start, install the [Flow command-line interface (CLI)](https://docs.onflow.org/flow-cli).

_⚠️ This project requires `flow-cli v0.15.0` or above._

### 2. Clone the project

```sh
git clone --recurse-submodules https://github.com/onflow/kitty-items.git
```

Kitty Items includes the `fcl-dev-wallet` as a submodule. To ensure you have the latest version of the wallet, you can run `git submodule update` to fetch the latest code at any time.

### 3. Rename `.env.example` files

Rename `.env.example` to `env.local` in the `web`, `api` and `fcl-dev-wallet` folders.
The `.env.local` files should be in their respective project directories.

```sh
kitty-items/
├─ api/
│  ├─ .env.local
├─ web/
│  ├─ .env.local
├─ fcl-dev-wallet/
│  ├─ .env.local
├─ ... etc
```

Replace the contents of `fcl-dev-wallet/.env.local` with:

```
FLOW_ACCESS_API=${ACCESS_API}
FLOW_ACCOUNT_ADDRESS=${FLOW_ADDRESS}
FLOW_ACCOUNT_KEY_ID=0
FLOW_ACCOUNT_PRIVATE_KEY=${FLOW_ACCOUNT_PRIVATE_KEY}
FLOW_ACCOUNT_PUBLIC_KEY=${FLOW_ACCOUNT_PUBLIC_KEY}
```

### 5. Start the Flow emulator

To find the values we'll need to complete setting up our environment, we'll need to start the Flow emulator.

```sh
flow emulator --persist
```

We're including the `--persist` flag, which will allow us to maintain the state of the emulated blockchain when we stop and restart the emulator. You should see the following output in your terminal:

```sh
INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7  serviceAddress=f8d6e0586b0a20c7 serviceHashAlgo=SHA3_256 servicePrivKey=f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5 servicePubKey=6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2 serviceSigAlgo=ECDSA_P256
INFO[0000] 📜  Flow contracts                             FlowFees=0xe5a8b7f23e8b548f FlowServiceAccount=0xf8d6e0586b0a20c7 FlowStorageFees=0xf8d6e0586b0a20c7 FlowToken=0x0ae53cb6e3f42a79 FungibleToken=0xee82856bf20e2aa6
INFO[0000] 🌱  Starting gRPC server on port 3569          port=3569
INFO[0000] 🌱  Starting HTTP server on port 8080          port=8080
```
This output contains the addresses for the contracts that are deployed to the emulator, as well as the address of the `FlowServiceAccount`– a pre-generated account you can use to easily get started deploying code to the emulator.

(☝️ **Note**: your local emulator's output may be different. Be sure to use values from _your own shell_ to ensure they match with your local environment).
### 6. Deploy Kitty Items contracts

Deployments are configured in `flow.json`. Examine the file, you'll see an entry for the contracts that will be deployed to the emulator's service account: 

```json
...
"emulator": {
  "emulator-account": [
    "Kibble",
    "KittyItems",
    "KittyItemsMarket",
    "NonFungibleToken"
  ]
}
...
```
#### Add the Non-Fungible Token contract address to your environment

Ensure the emulator is still running and in another shell run the following command (in the folder containing the `flow.json` file):

```sh
flow project deploy --network=emulator
```
You should see the following output with the addresses of the contracts that were deployed to the emulator's service account:
```sh
Deploying 4 contracts for accounts: emulator-account

Kibble -> 0xf8d6e0586b0a20c7
NonFungibleToken -> 0xf8d6e0586b0a20c7
KittyItems -> 0xf8d6e0586b0a20c7
KittyItemsMarket -> 0xf8d6e0586b0a20c7

✨ All contracts deployed successfully
```

Update the value for `NON_FUNGIBLE_TOKEN_ADDRESS` in `scripts/run-local.sh` using the address form your emulator's output: 

eg:
```
... other vars
NON_FUNGIBLE_TOKEN_ADDRESS=0xf8d6e0586b0a20c7
...
```

(☝️ **Note**: your local emulator's output may be different. Be sure to use values from _your own shell_ to ensure they match with your local environment).
### 7. Start the project

From the root of the project run: `npm install` to install `lerna`.

Once finished run `lerna exec npm install` to install the project's dependencies.

From the root of the project run `npm run start:dev` to start Kitty Items in local development mode!

---

🚀 Happy Hacking!
