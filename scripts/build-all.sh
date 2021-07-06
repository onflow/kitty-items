#!/bin/bash

# Build the apps, don't build fcl-dev-wallet because we can run the dev-wallet 
# dev-server instead.  

npx lerna exec npm install --ignore=fcl-dev-wallet 
npx lerna exec npm run build --ignore=fcl-dev-wallet 
