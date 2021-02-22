# kitty-items-js

`kitty-items-js` is a RESTful API built with express that sends transactions to Flow using the [flow-js-sdk](https://github.com/onflow/flow-js-sdk/).

## Getting started

### Install dependencies

```
npm install
```

### Use your Flow Testnet account

You'll need the **account address** and 
**private key** for your Flow Testnet account to complete these setup steps.

Read the [Getting Started](https://github.com/onflow/kitty-items#-get-started)
guide if you haven't created a Testnet account yet.

### Configure your environment

Create a copy of `.env.example`:

```sh
cp .env.example .env
```

Open `.env` and replace the following placeholders with the values for your Flow account:

```
MINTER_FLOW_ADDRESS={YOUR_TESTNET_ADDRESS}
MINTER_PRIVATE_KEY={YOUR_TESTNET_PRIVATE_KEY}
SALE_OFFER_EVENT_NAME=A.{YOUR_TESTNET_ADDRESS}.KittyItemsMarket.SaleOfferCreated
```

### Start the database

> 🚧  You'll need to have Docker installed to complete this step.

```
docker-compose up -d
```

### Start the API server

```
npm run start:dev
```

### Try it out!

✨ The API should now be available at http://localhost:3000.

_Note: when the API starts, 
it will automatically run the database migrations for the configured `DATABASE_URL` URL._

## Setup Flow Accounts

Now that the API is up and running, you'll need to use it to deploy contracts to your Flow Testnet account (`MINTER_FLOW_ADDRESS`). 
Follow the instructions available on [kitty-items-deployer](https://github.com/onflow/kitty-items/tree/master/kitty-items-deployer).


## Setup Resources

Before you can mint Kibbles and Kitty Items, you'll need to deploy all of the required Cadence contracts to Flow. 
Use the requests in this section to initialize the **collections** and **vaults** that your account (`MINTER_FLOW_ADDRESS`) needs in order to hold fungible and non-fungible tokens.

Run the following commands in your terminal:

- **POST /v1/kibbles/setup** : Creates a resource that holds Kibbles in the `MINTER_FLOW_ADDRESS` account.     
```
  curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/kitty-items/setup** : Creates a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.  
```
  curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/market/setup**: Creates a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Kitty Items.
```
  curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
  ```

## Mint Kibbles and Kitty Items
Now that the marketplace contracts and accounts are ready,
you can fill the market with Kibble and Kitty Items!

Run the following commands in your terminal: 

- **POST /v1/kibbles/mint** - mints Kibbles (fungible token) to the specified Flow Address.

Payload:
```
{
	"recipient": "0xafad45913fb07dba",
	"amount": 2.0
}
  ```
```
curl --request POST \
--url http://localhost:3000/v1/kibbles/mint \
--header 'Content-Type: application/json' \
--data '{
	"recipient": "0xafad45913fb07dba",
	"amount": 2.0
}'
```

- **POST /v1/kitty-items/mint** : Mints a Kitty Item (NFT) to the `recipient` account.
```
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
	"recipient": "0xba1132bc08f82fe2",
	"typeId": 1
}'
```

- **POST /v1/market/sell** : Puts a Kitty Item for sale
```
curl --request POST \
--url http://localhost:3000/v1/market/sell \
--header 'Content-Type: application/json' \
--data '{
	"itemId": 5,
	"price": 7.9
}'
```

### Start the event worker

Now your accounts and contracts are setup, you can start the event worker. The event worker script will help us capture events coming from Flow and save them in the events database we started using `docker-compose`, making those events available to consumers of our RESTful API.

```
npm run workers:dev
```

## Next steps

Now that the API is configured, [launch the front-end app](https://github.com/onflow/kitty-items/tree/master/kitty-items-web) to start interacting with your new marketplace!
