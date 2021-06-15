#!/bin/bash

export FLOW_ADDRESS=
export NON_FUNGIBLE_TOKEN_ADDRESS=0x631e88ae7f1d7c20
export FUNGIBLE_TOKEN_ADDRESS=0x9a0766d93b6608b7

export CHAIN_ENV=testnet
export ACCESS_NODE=https://access-testnet.onflow.org
export WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
export API_URL=http://localhost:3000

react-scripts start
