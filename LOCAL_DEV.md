# 😺 Kitty Items - Local Development 👩‍💻

## 👋 Introduction
We chose to connect Kitty Items to Flow's testnet because we wanted users to see how easy it was to take a non-trivial application to a live Flow network.

Of course, some users may want to expreiment with their smart contracts before deploying them, or otherwise prototype their appliccation before publishing it.
In this section we'll detial how to set up your local environment for dapp development on Flow.

## 🛠 Tools you'll use
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

## ✨ Getting Started

### 1. Install the Flow CLI

Before you start, install the [Flow command-line interface (CLI)](https://docs.onflow.org/flow-cli).

_⚠️ This project requires `flow-cli v0.15.0` or above._

### 2. Clone the project

```sh
git clone https://github.com/onflow/kitty-items.git
```

### 2.b Initialize the `fcl-dev-wallet` submodule

If you've already cloned the project, or you're starting fresh, you'll neeed to include the `fcl-dev-wallet`.

```sh
git submidule init && git submodule update
```

This command will clone the `fcl-dev-wallet` as a submodule in your repository. We're including the code as a submodule (and not a package) for the time being, because the wallet is still in early development.
To ensure you have the latest version of the wallet, you can simply run `git submodule update` to fetch the latest code.

### 3. Create `.env` files

Create `.env.local` in the `web` and `api` folders.

```sh
cd ./web
cp .env.example .env.local
```

```sh
cd ./api
cp .env.example .env.local
```

### 4. Configure your environment

Next we'll add important configuration values in 3 files:
  - `flow.json`
  - `web/.env.local`
  - `api/.env.local`

The `.env.local` files should b e placed in their respective project directories, while `flow.json` can be found at the root of the project.

```sh
kitty-items/
├─ api/
│  ├─ .env.local
├─ web/
│  ├─ .env.local
├─ flow.json

```

**Replace the content of  `api/.env.local`:**

```sh
MINTER_ADDRESS=
MINTER_PRIVATE_KEY=
MINTER_ACCOUNT_KEY_INDEX=

FLOW_ACCESS_NODE=http://localhost:8080  # <-- Emulator "access node"

FUNGIBLE_TOKEN_ADDRESS=
NON_FUNGIBLE_TOKEN_ADDRESS=

DATABASE_URL=postgresql://kittyuser:kittypassword@localhost:5432/kittyitems
MIGRATION_PATH=src/migrations

BLOCK_WINDOW=1
```

**Replace the content of `web/.env.local`:**

```sh
REACT_APP_CHAIN_ENV=emulator # <-- Set chain env to emulator
REACT_APP_FLOW_ACCESS_NODE=http://localhost:8080 # <-- Emulator "access node"
REACT_APP_WALLET_DISCOVERY=http://localhost:9999/fcl/authn # <-- fcl-dev-wallet endpoint

REACT_APP_CONTRACT_FUNGIBLE_TOKEN=
REACT_APP_CONTRACT_NON_FUNGIBLE_TOKEN=

REACT_APP_API_KIBBLE_MINT=http://localhost:3000/v1/kibbles/mint
REACT_APP_API_KITTY_ITEM_MINT=http://localhost:3000/v1/kitty-items/mint
REACT_APP_API_MARKET_ITEMS_LIST=http://localhost:3000/v1/market/latest

REACT_APP_CONTRACT_KIBBLE=
REACT_APP_CONTRACT_KITTY_ITEMS=
REACT_APP_CONTRACT_KITTY_ITEMS_MARKET=
```

Here you can see we're setting up to connect to the Flow Emulator and the `fcl-dev-wallet` by specifying their
respective host interfaces.

In the next step we'll add the missing values in our `.env.local` files for: 
- The Flow account that we'll deploy the Kitty-Items contracts to.
- The private key for that account.
- The addresses of the deployed contracts we'll use for this project

### 5. Start the Flow emulator

To find the values we'll need to complete settin up our environment, we'll need to start the Flow emulator.

```sh
flow emulator --persist
```

We're including the persist option, which will allow us to maintin the state of the emulatoed blockchain when we stop and restart the emulator. 
You should see the following output in your terminal:

```sh
INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7  serviceAddress=f8d6e0586b0a20c7 serviceHashAlgo=SHA3_256 servicePrivKey=f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5 servicePubKey=6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2 serviceSigAlgo=ECDSA_P256
INFO[0000] 📜  Flow contracts                             FlowFees=0xe5a8b7f23e8b548f FlowServiceAccount=0xf8d6e0586b0a20c7 FlowStorageFees=0xf8d6e0586b0a20c7 FlowToken=0x0ae53cb6e3f42a79 FungibleToken=0xee82856bf20e2aa6
INFO[0000] 🌱  Starting gRPC server on port 3569          port=3569
INFO[0000] 🌱  Starting HTTP server on port 8080          port=8080
```
This output contains the addresses for the contracts that are built into the emulator, as well as the address of the `FlowServiceAccount`, a pre-generated account you can use to easily get started deploying code to the emulator. We'll use the following values from the emulator's output in our `.env.local` files: 

(☝️ **Note**: your local emulator's output may be different. Be sure to use values from _your own shell_ to ensure they match with your local environment).

#### Add the Flow Service Account address and private key

In `web/.env.local` add the value of `FlowServiceAccount` in your emulator's output as:
  - `REACT_APP_CONTRACT_KIBBLE`
  - `REACT_APP_CONTRACT_KITTY_ITEMS`
  - `REACT_APP_CONTRACT_KITTY_ITEMS_MARKET`

In `api/.env.local`: 
  - Add the value of `FlowServiceAccount` in your emulator's output as:
    - `MINTER_ADDRESS`

  - Add the value of `servicePrivKey` from your emulator's output as:
    - `MINTER_PRIVATE_KEY`

#### Add the Fungible Token contract address

Next we'll update the address of the emeulator's `FungibleToken` contract. 

In `api/.env.local` add the value of `FungibleToken` in your emulator's output to: 
  - `FUNGIBLE_TOKEN_ADDRESS`

In `web/.env.local` add the value of `FungibleToken` in your emulator's output to: 
  - `REACT_APP_CONTRACT_FUNGIBLE_TOKEN`

### 6. Deploy Kitty Items contracts

To get the address for the Non-Fungible token contract we'll first have to deploy it to the emulator.
Deployments are configured in `flow.json`. Examine the file, you'll see an entry for the contracts that will be deployed to the emulator's service account: 

```json:title=flow.json
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
You should see the following output with the addresses of the contracts that were deployed to the emaulator's service account:
```sh
Deploying 4 contracts for accounts: emulator-account

Kibble -> 0xf8d6e0586b0a20c7
NonFungibleToken -> 0xf8d6e0586b0a20c7
KittyItems -> 0xf8d6e0586b0a20c7
KittyItemsMarket -> 0xf8d6e0586b0a20c7

✨ All contracts deployed successfully
```
In `api/.env.local` add the value of `NonFungibleToken` in your emulator's output to: 
  - `NON_FUNGIBLE_TOKEN_ADDRESS`

In `web/.env.local` add the value of `NonFungibleToken` in your emulator's output to: 
  - `REACT_APP_CONTRACT_NON_FUNGIBLE_TOKEN`


### 7. Finish up!

Now that you've added the environment variables you'll need to run the applicatino locally there are only a few more steps.

#### Install and start `fcl-dev-wallet`

The emulator hould still be running in your shell. Follow the <a href="https://github.com/onflow/fcl-dev-wallet" target="_blank">instructions here</a> for installing `fcl-dev-wallet`. 

**Note:** When starting the wallet in Kitty-Items, use port `9999`. This is the configured port for `REACT_APP_WALLET_DISCOVERY` in `web/.env.local`:  
  - Use: `npm run dev -- -p 9999`

#### Start the API and Web projects

Once the emulator and `fcl-dev-wallet` are running: 
  - Start up the API server, and bootstrap the Marketplace by following the <a href="https://github.com/onflow/kitty-items/tree/master/api">instructions here</a>. ☝️ Be sure to use `npm run start:dev` to start the project using the local development environment variables you created earlier.
  - Start the web project by following the <a href="https://github.com/onflow/kitty-items/tree/master/web">instructions here.</a> ☝️ Be sure to use `npm run start:dev` to start the project using the local development environment variables you created earlier.


If everything goes well, you're ready to begin local development using the `flow-cli` and the Flow emulator. 👌

---

🚀 Happy Hacking!
