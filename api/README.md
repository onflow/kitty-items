# Kitty Items JS

Kitty Items JS is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/flow-js-sdk/).

## Getting started

### 1. Install dependencies

```sh
npm install
```

### 2. Use your Flow Testnet account

You'll need the **account address** and
**private key** for your Flow Testnet account to complete these setup steps.

Read the [Getting Started](https://github.com/onflow/kitty-items#-get-started)
guide if you haven't created a Testnet account yet.

### 3. Configure your environment

Create a copy of `.env.example`:

```sh
cp .env.example .env.local
```

Open `.env.local` and replace the following placeholders with the values for your Testnet account:

```
MINTER_FLOW_ADDRESS={YOUR_TESTNET_ADDRESS}
MINTER_PRIVATE_KEY={YOUR_TESTNET_PRIVATE_KEY}
```

### 4. Start the database

> 🚧 You'll need to have Docker installed to complete this step.

We'll use the included docker compose file to start an instance of Postgres we'll need to track listings in the marketplace.<br/>

In the project's root directory run:

```sh
docker-compose up -d
```

### 5. Start the API server

```sh
npm run start:dev
```

### Try it out!

✨ The API should now be available at http://localhost:3000.

_Note: when the API starts,
it will automatically run the database migrations for the configured `DATABASE_URL` URL._

### 6. Initialize your account

Before you can mint Kibbles and Kitty Items,
you'll need to initialize your account with the following:

- An empty `Kibble` vault
- An empty `KittyItems` collection
- An empty `KittyItemsMarket` collection

You can read more about `Vault` and `Collection` resources [in this tutorial](https://docs.onflow.org/cadence/tutorial/01-first-steps/)

Run the commands below to initialize these resources:

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

### 7. Mint Kibbles and Kitty Items

Now that your account is ready,
you can fill the market with Kibble and Kitty Items!

Run the commands below to mint new Kibble,
create new items,
and list some items for sale:

- **POST /v1/kibbles/mint** - Mint new Kibble
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kibbles/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "{YOUR_TESTNET_ADDRESS}",
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
    "recipient": "{YOUR_TESTNET_ADDRESS}",
    "typeId": 1
  }'
```

- **POST /v1/market/sell** - Put a Kitty Item up for sale.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemId": 0,
    "price": 7.9
  }'
```

## Start the event worker

Lastly, we need to allow our back-end to capture events emitted by
the Kitty Items contracts.

The event worker is a small service that continuously watches the
blockchain for relevant events and saves them to our application database.

For example, if somebody purchases a Kitty Item from the market,
our event worker will detect the event and
mark the item as purchased in our database.

In a separate process, start the event worker:

```sh
npm run workers:dev
```

## Next steps

Now that the API is configured, [launch the front-end app](https://github.com/onflow/kitty-items/tree/master/web) to start interacting with your new marketplace!
