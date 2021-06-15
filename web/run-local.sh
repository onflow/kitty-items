#!/bin/bash -e

export FLOW_ADDRESS=0xf8d6e0586b0a20c7
export NON_FUNGIBLE_TOKEN_ADDRESS=0xf8d6e0586b0a20c7
export FUNGIBLE_TOKEN_ADDRESS=0xee82856bf20e2aa6

export CHAIN_ENV=emulator
export ACCESS_NODE=http://localhost:8080
export WALLET_DISCOVERY=http://localhost:8701/fcl/authn
export API_URL=http://localhost:3000

export PORT=3001

npm run dev --prefix ../fcl-dev-wallet -- -p 8701  &
npm run start:dev

