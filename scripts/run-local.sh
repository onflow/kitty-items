#!/bin/bash

export CHAIN_ENV=emulator 

export FLOW_ADDRESS=0xf8d6e0586b0a20c7  
export FLOW_PRIVATE_KEY=f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5
export FLOW_PUBLIC_KEY=6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2

export FUNGIBLE_TOKEN_ADDRESS=0xee82856bf20e2aa6
export NON_FUNGIBLE_TOKEN_ADDRESS=0xf8d6e0586b0a20c7

export API_URL=http://localhost:3000
export FLOW_ACCESS_API=http://localhost:8080
export WALLET_DISCOVERY=http://localhost:8701/fcl/authn

lerna run dev --parallel
