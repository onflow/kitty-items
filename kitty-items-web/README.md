# Kitty Items Web

- An example application built to use the Flow Blockchain.
- The majority of its features are directly powered by contracts on chain.

You can see a working demo of this app at [https://kitty-items.on.fleek.co](https://kitty-items.on.fleek.co).
It is hosted on IPFS via [https://fleek.co/](https://fleek.co/).

## Run locally against Flow (testnet)

```sh
cd ./kitty-items-web          # make the kitty-items-web directory your current directory
cp .env.example .env.local    # copy the .env.example file .env.local -- this will configure the web app to point to testnet
yarn                          # install the dependencies from the lock file
yarn start                    # start up the web app
```
