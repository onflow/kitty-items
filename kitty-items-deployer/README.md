# kitty-items-deployer

Deploys the Kibbles, KittyItems and Marketplace contracts to the Flow Blockchain.

# Setup

- Install npm dependencies:

```shell
npm install
```

- Create a `.env` file based out of `.env.example`. Replace the values for
  `ACCOUNT_ADDRESS` and `ACCOUNT_PRIVATE_KEY` according to the Flow Account we want to use to deploy the contracts to.
  
- Run:

```shell
npm run start:dev
```

- After running the command above, the contracts should be successfully deployed, like so:

```shell
starting deployment of contracts, accessNode: https://access-testnet.onflow.org  address: 17341c7824b030be
deploying...
deploying kibbles contract...
add contract name: Kibble
deployed kibbles contract
deploying kitty items contract...
add contract name: KittyItems
deployed kitty items contract
deploying kitty items marketplace...
add contract name: KittyItemsMarket
deployed kitty items marketplace
result {
        kibble: {                                                                                            
    status: 4,                                  
    statusCode: 0,
    errorMessage: '',         
    events: [ [Object], [Object] ]                                                                     
  },
        kittyItems: {                 
          status: 4,                              
          statusCode: 0,                      
          errorMessage: '',
          events: [ [Object], [Object] ]
        },
        kittyItemsMarket: { status: 4, statusCode: 0, errorMessage: '', events: [ [Object] ] }
        }
```

You can browse the contracts deployed on `https://flow-view-source.com/testnet/account/ACCOUNT_ADDRESS`. 