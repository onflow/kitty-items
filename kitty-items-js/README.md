# kitty-items-js

RESTful API built with express that sends transactions to the Flow Blockchain, using the [flow-js-sdk](https://github.com/onflow/flow-js-sdk/).

## Get Started

### Install npm dependencies

```
npm install
```

### Use your Flow Testnet Account
You'll need the **account keys** and **account** ID for your Flow Testnet account to complete these setup steps.
If you haven't created an account read the [Getting Started Guide](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme#-get-started)

### Update `.env.local`
- In this project, rename `env.local` to `.env`
- Open `.env` and replace these values with values for your Flow account.
```
MINTER_FLOW_ADDRESS="Flow account ID"  
MINTER_PRIVATE_KEY="Flow account private key"
```
- Configure the value `SALE_OFFER_EVENT_NAME` using the Flow event
  format: `A.ContractAddress.Contract.EventName`. 
  
  For example:
  If you have `MINTER_FLOW_ADDRESS=fcceff21d9532b58` then the value you should have in `.env` is: 
  `SALE_OFFER_EVENT_NAME=A.fcceff21d9532b58.KittyItemsMarket.SaleOfferCreated`


### Start the Database

```
docker-compose up -d
```

### Start the API Server:

```
npm run start:dev
```

✨ If everyting worked the API will be available at http://localhost:3000
(Note that when the API starts, it will automatically run the database migrations for the configured `DATABASE_URL` url)

### Start the Event Worker

The event worker script will help us capture events coming from Flow and save them in the events database we started in the first step, making those evenbts available to consumers of the REST API.

```
npm run workers:dev
```

## Setup Accounts

Now that the API is up and running, you'll need to use it to deploy contracts to your Flow Testnet account (`MINTER_FLOW_ADDRESS`). 
Follow the instructions available on [kitty-items-deployer](https://github.com/dapperlabs/kitty-items/tree/master/kitty-items-deployer).


## Setup Resources

Before you can mint Kibbles and Kitty Items, you'll need to deploy all of the required Cadence contracts to  Flow 
Use the requests in this section to initialize the **collections** and **vaults** that your account (`MINTER_FLOW_ADDRESS`) needs in order to hold fungible and non-fungible tokens!

Run the following commands in your terminal:

- **POST /v1/kibbles/setup** : Creates a resource that holds Kibbles in the `MINTER_FLOW_ADDRESS` account.     
```
  curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'
```  

- **POST /v1/kitty-items/setup** : Creates a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.  
```
  curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```  

- **POST /v1/market/setup**: Creates a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Kitty Items.
```
  curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
  ```

## Mint Kibbles and Kitty Items
Now that the marketplace contracts and accounts are ready, you can fill the market with Kibble and Kitty items!

Run the following commands in your terminal: 

- **POST /v1/kibbles/mint** - mints Kibbles (fungible token) to the specified Flow Address.

Payload:
```
{
	"recipient": "0xafad45913fb07dba",
	"amount": 2.0
}
  ```
```
curl --request POST \
--url http://localhost:3000/v1/kibbles/mint \
--header 'Content-Type: application/json' \
--data '{
	"recipient": "0xafad45913fb07dba",
	"amount": 2.0
}'
```

- **POST /v1/kitty-items/mint** : Mints a Kitty Item (NFT) to the `recipient` account.
```
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
	"recipient": "0xba1132bc08f82fe2",
	"typeId": 1
}'
```

- **POST /v1/market/sell** : Puts a Kitty Item for sale
```
curl --request POST \
--url http://localhost:3000/v1/market/sell \
--header 'Content-Type: application/json' \
--data '{
	"itemId": 5,
	"price": 7.9
}
'
```

## Finish Up

Once you've made these requests, all of the contracts required for this application have been deployed, and your account has been configured as the marketplace admin! 

Now that the backend [install and run the front-end](https://github.com/onflow/kitty-items/tree/mackenzie/updates-readme/kitty-items-web) to start interacting with your new marketplace!
