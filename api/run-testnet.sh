#!/bin/bash

export FLOW_ADDRESS=
export NON_FUNGIBLE_TOKEN_ADDRESS=0x631e88ae7f1d7c20
export FUNGIBLE_TOKEN_ADDRESS=0x9a0766d93b6608b7

export ACCESS_NODE=http://localhost:8000

tsnd --respawn src/index.ts --dev
