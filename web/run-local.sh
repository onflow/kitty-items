#!/bin/bash -e

export FLOW_ADDRESS= 
export NON_FUNGIBLE_TOKEN_ADDRESS=
export FUNGIBLE_TOKEN_ADDRESS=0xee82856bf20e2aa6

export CHAIN_ENV=emulator
export ACCESS_NODE=http://localhost:8080
export WALLET_DISCOVERY=http://localhost:9999/fcl/authn
export API_URL=http://localhost:3000

npm run dev --prefix ../fcl-dev-wallet &
react-scripts start &

