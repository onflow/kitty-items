#!/usr/bin/env bash

curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "0x9ed5319b6743ccd0",
    "typeId": 1
  }'

  curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "0x9ed5319b6743ccd0",
    "typeId": 2
  }'


  curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "0x9ed5319b6743ccd0",
    "typeId": 3
  }'

 curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "0x9ed5319b6743ccd0",
    "typeId": 3
  }'