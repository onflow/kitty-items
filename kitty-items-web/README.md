# Kitty Items Web

- An example application built to use the Flow Blockchain.
- The majority of its features are directly powered by contracts on chain.

You can see a working demo of this app at [https://kitty-items.on.fleek.co](https://kitty-items.on.fleek.co).
It is hosted on IPFS via [https://fleek.co/](https://fleek.co/).

## Run locally against Flow Testnet

```sh
cd ./kitty-items-web          # make the kitty-items-web directory your current directory
cp .env.example .env.local    # copy the .env.example file .env.local -- this will configure the web app to point to Testnet
yarn                          # install the dependencies from the lock file
yarn start                    # start up the web app
```

## Learn More

If you are wanting to learn more about what is happening in here we recommend checking out the [FCL Quick Start Guide](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl#flow-app-quickstart).
In it you will see a lot of overlap of the code in this project.

If you have any questions, concerns, comments, just want to say hi, we would love to have your company in our [discord](https://discord.gg/k6cZ7QC)
