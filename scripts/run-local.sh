#!/bin/bash

export CHAIN_ENV=emulator 

export FLOW_ADDRESS=0xf8d6e0586b0a20c7  
export FUNGIBLE_TOKEN_ADDRESS=0xee82856bf20e2aa6
export NON_FUNGIBLE_TOKEN_ADDRESS=


export API_URL=http://localhost:3000
export ACCESS_NODE=http://localhost:8080
export WALLET_DISCOVERY=http://localhost:8701/fcl/authn

lerna run start:dev --parallel
