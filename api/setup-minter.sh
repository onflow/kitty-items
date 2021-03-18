#!/usr/bin/env bash

# Setup minter account

curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'

Mint Kibble and Kitty Items

curl --request POST \
  --url http://localhost:3000/v1/kibbles/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'${MINTER_ADDRESS}'",
    "amount": 50.0
  }'

curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'${MINTER_ADDRESS}'",
    "typeId": 1
  }'

curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemId": 0,
    "price": 7.5
  }'
