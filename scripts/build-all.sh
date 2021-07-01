#!/bin/bash

# Build the apps, don't attempt to build fcl-dev-wallet. 

npx lerna exec npm install --scope fcl-dev-wallet 
npx lerna exec npm run build --scope fcl-dev-wallet 
