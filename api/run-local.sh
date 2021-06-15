#!/bin/bash

export FLOW_ADDRESS=
export NON_FUNGIBLE_TOKEN_ADDRESS=
export FUNGIBLE_TOKEN_ADDRESS=0xee82856bf20e2aa6

export ACCESS_NODE=http://localhost:8000

tsnd --respawn src/index.ts --dev
