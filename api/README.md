# Kitty Items API

The Kitty Items API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/flow-js-sdk/).

### Getting Started

_💡 Learn more about `Vault` and `Collection` resources [in this tutorial](https://docs.onflow.org/cadence/tutorial/01-first-steps/)._

#### Minter setup script

Run this script to set up the minter account and mint an initial supply of Kibble and Kitty Items:


```sh
./setup-minter.sh
```

## Appendix: API Reference

### Setup

Run the commands below to initialize the minter account to hold and mint Kibble,
Kitty Items, and add offers to the marketplace.

- **POST /v1/fusd/setup** - Create a resource that holds FUSD in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/fusd/setup \
  --header 'Content-Type: application/json'
```

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

- **POST /v1/fusd/mint** - Mint new FUSD and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/fusd/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "amount": 2.0
  }'
```

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
