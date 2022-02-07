# Kitty Items API

The Kitty Items API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/fcl-js/tree/master/packages/sdk).

## Setup

Run the commands below to initialize the minter account.

- **POST /v1/kitty-items/setup** - Create a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/market/setup** - Create a resource that allows the `MINTER_FLOW_ADDRESS` to hold listings for Kitty Items.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
```

## Minting

Run the commands below to mint new items and list them for sale.

- **POST /v1/kitty-items/mint** - Mint a Kitty Item
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$ADMIN_ADDRESS'",
    "kind": 1
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
