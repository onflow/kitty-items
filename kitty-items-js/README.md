# kitty-items-js

API that sends transactions to the Flow Blockchain, using the [flow-js-sdk](https://github.com/onflow/flow-js-sdk/).
This API currently supports:

- Minting Kibbles (fungible token)
- Minting Kitty Items (non-fungible token)
- Creating Sale Offers for Kitty Items

### Setup

- Install npm dependencies:

```
npm install
```

- Run docker:

```
docker-compose up -d
```

- Create a `.env` file based out of `.env.example`. Refer to `Creating a new Flow Account on Testnet` section below in
  order to setup your private key for the `MINTER_PRIVATE_KEY` variable.

- Deploy contracts to the Flow Testnet to the Flow account obtained from the previous step. Follow the instructions
  available on [kitty-items-deployer](https://github.com/dapperlabs/kitty-items/tree/master/kitty-items-deployer).

- Start app:

```
npm run start:dev
```

Note that when the API starts, it will automatically run the database migrations for the configured `DATABASE_URL` url.

- Run docker:

```
docker-compose up -d
```

- Start workers / flow event handlers:

```
npm run workers:dev
```

### Creating a new Flow Account on Testnet

In order to create an account on Testnet to deploy the smart contracts and mint Kibbles or Kitty Items, follow these
steps:

- Head to https://testnet-faucet.onflow.org/
- Generate a Public / Private Key Pair using the following command from [Flow CLI](https://docs.onflow.org/flow-cli/):
  ```shell
  flow keys generate
  ```
  Make sure to save these keys in a safe place. The private key will be used as the environment
  variable `MINTER_PRIVATE_KEY`.
- Sign up for `Creating an account` with the public key generated from the previous step.
- When the account is approved, you will receive an e-mail with your newly created Flow account ID. This account ID will
  be used as the environment variable for `MINTER_FLOW_ADDRESS`.

### Creating a new database migration:

```shell
npm run migrate:make
```

Migrations are run automatically when the app initializes
