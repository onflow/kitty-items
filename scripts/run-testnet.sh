#!/bin/bash

export CHAIN_ENV=testnet 

export FUNGIBLE_TOKEN_ADDRESS=0x9a0766d93b6608b7
export NON_FUNGIBLE_TOKEN_ADDRESS=

export API_URL=http://localhost:3000

export ACCESS_API_WEB=https://access-testnet.onflow.org
export ACCESS_API_DOCKER=https://access-testnet.onflow.org

export WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

export DB_NAME=kittyitems
export DB_USER_USER=kittyuser
export DB_PASSWORD=kittypassword
export DB_URL=postgresql://kittyuser:kittypassword@localhost:5432/kittyitems

if [ -z "$NON_FUNGIBLE_TOKEN_ADDRESS" ]
then
    echo "NON_FUNGIBLE_TOKEN_ADDRESS not set!"
    exit 1
fi

if [ -z "$FLOW_PRIVATE_KEY" ]
then
    echo "FLOW_PRIVATE_KEY not set!"
    exit 1
fi

if [ -z "$FLOW_ADDRESS" ]
then
    echo "FLOW_ADDRESS not set!"
    exit 1
fi


docker compose --profile testnet up -d 

# Wait just to be sure.
sleep 5

flow project deploy --network=testnet

# Done!
