#!/bin/bash

# Build the apps, don't attempt to build fcl-dev-wallet. 

npx lerna exec npm install --ignore=fcl-dev-wallet 
npx lerna exec npm run build --ignore=fcl-dev-wallet 
