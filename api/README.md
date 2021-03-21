# Kitty Items API

The Kitty Items API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/flow-js-sdk/).

## Getting started

### 1. Install dependencies

```sh
cd ./api

npm install
```

### 2. Use your Flow Testnet account

You'll need the **account address** and
**private key** for your Flow Testnet account to complete these setup steps.

Read the [Getting Started](https://github.com/onflow/kitty-items#-get-started)
guide if you haven't created a Testnet account yet.

```sh
# Replace these values with your own!
export FLOW_ADDRESS=0xabcdef12345689
export FLOW_PRIVATE_KEY=xxxxxxxxxxxx
```

### 3. Configure your environment

Create a copy of `.env.example`:

```sh
cp .env.example .env.local
```

### 4. Start the database

> 🚧 You'll need to have Docker installed to complete this step.

We'll use the included `docker-compose` file to start a Postgres instance for this API.

```sh
docker-compose up -d
```

### 5. Start the API server

```sh
npm run start:dev
```

### 6. Set up the minter account

Before you can mint Kibbles and Kitty Items,
you'll need to initialize your account with the following:

- An empty `Kibble` vault
- An empty `KittyItems` collection
- An empty `KittyItemsMarket` collection

_💡 Learn more about `Vault` and `Collection` resources [in this tutorial](https://docs.onflow.org/cadence/tutorial/01-first-steps/)._

#### Minter setup script

Run this script to set up the minter account and mint an initial supply of Kibble and Kitty Items:


```sh
./setup-minter.sh
```

### Try it out!

✨ The API should now be available at http://localhost:3000.

_Note: when the API starts,
it will automatically run the database migrations for the configured `DATABASE_URL` URL._

## Next steps

Now that the API is configured, [launch the front-end app](https://github.com/onflow/kitty-items/tree/master/web#readme) to start interacting with your new marketplace!

---

## Appendix: API Reference

### Setup

Run the commands below to initialize the minter account to hold and mint Kibble,
Kitty Items, and add offers to the marketplace.

- **POST /v1/kibbles/setup** - Create a resource that holds Kibble in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/kitty-items/setup** - Create a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/market/setup** - Create a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Kitty Items.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
```

### Minting

Run the commands below to mint new Kibble, create new items,
and list some items for sale.

- **POST /v1/kibbles/mint** - Mint new Kibble
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kibbles/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "amount": 2.0
  }'
```

- **POST /v1/kitty-items/mint** - Mint a Kitty Item
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "typeID": 1
  }'
```

- **POST /v1/market/sell** - Put a Kitty Item up for sale.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemID": 0,
    "price": 7.9
  }'
```
