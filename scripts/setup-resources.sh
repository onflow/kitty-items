#!/usr/bin/env bash

curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'