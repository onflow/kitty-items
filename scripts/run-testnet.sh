#!/bin/bash

export CHAIN_ENV=testnet 

export FUNGIBLE_TOKEN_ADDRESS=0x9a0766d93b6608b7
export NON_FUNGIBLE_TOKEN_ADDRESS=0x631e88ae7f1d7c20

export API_URL=http://localhost:3000
export ACCESS_API=https://access-testnet.onflow.org
export WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

export DB_NAME=kittyitems
export DB_USER_USER=kittyuser
export DB_PASSWORD=kittypassword
export DB_URL=postgresql://kittyuser:kittypassword@localhost:5432/kittyitems

docker compose --profile testnet up -d 

# Wait just to be sure.
sleep 5

flow project deploy --network=testnet

# Done!
