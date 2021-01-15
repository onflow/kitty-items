# kitty-items-js

API that sends transactions to the Flow Blockchain, using the [flow-js-sdk](https://github.com/onflow/flow-js-sdk/).
This API currently supports:

- Minting Kibbles (fungible token)
- Minting Kitty Items (non-fungible token)
- Creating Sale Offers for Kitty Items

## Setup / Running the API

- Install npm dependencies:

```
npm install
```

- Run docker:

```
docker-compose up -d
```

- Create a `.env` file based out of `.env.example`. Refer to `Creating a new Flow Account on Testnet` section below in
  order to setup your private key for the `MINTER_PRIVATE_KEY` variable.

- Deploy contracts to the Flow Testnet to the Flow account obtained from the previous step. Follow the instructions
  available on [kitty-items-deployer](https://github.com/dapperlabs/kitty-items/tree/master/kitty-items-deployer).

- Start app:

```
npm run start:dev
```

Note that when the API starts, it will automatically run the database migrations for the configured `DATABASE_URL` url.
Try out the endpoints at the `Sample Endpoints` section. Note that in order to

## Running Worker / Event consumer

- Run docker:

```
docker-compose up -d
```

- Configure the value `SALE_OFFER_EVENT_NAME` on the `.env`, following the Flow event
  format (`A.ContractAddress.Contract.EventName`). For example:
  `A.fcceff21d9532b58.KittyItemsMarket.SaleOfferCreated`, where the address where the contracts have been deployed
  is `fcceff21d9532b58`.

- Start workers / flow event handlers:

```
npm run workers:dev
```

## Creating a new Flow Account on Testnet

In order to create an account on Testnet to deploy the smart contracts and mint Kibbles or Kitty Items, follow these
steps:

- Head to https://testnet-faucet.onflow.org/
- Generate a Public / Private Key Pair using the following command from [Flow CLI](https://docs.onflow.org/flow-cli/):
  ```shell
  flow keys generate
  ```
  Make sure to save these keys in a safe place. The private key will be used as the environment
  variable `MINTER_PRIVATE_KEY`.
- Sign up for `Creating an account` with the public key generated from the previous step.
- When the account is approved, you will receive an e-mail with your newly created Flow account ID. This account ID will
  be used as the environment variable for `MINTER_FLOW_ADDRESS`.

## Sample endpoints

For a list of endpoints available on the API, look into the `routes` folder.

### Setup Resources

Before you can mint Kibbles and Kitty Items, you should run the requests in this section. They will initialize the
collections and vaults that your account (`MINTER_FLOW_ADDRESS`) needs in order to hold fungible and non-fungible
tokens.

- **POST /v1/kibbles/setup** : Creates a resource that holds Kibbles in the `MINTER_FLOW_ADDRESS` account. 
  
  - Example:
  
```
  curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'
```  

- **POST /v1/kitty-items/setup** : Creates a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.
  - Example:
  
```
  curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```  

- **POST /v1/market/setup**: Creates a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Kitty Items.
  - Example:

```
  curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
  ```

### Mint Kibbles and Kitty Items

- **POST /v1/kibbles/mint** - mints Kibbles (fungible token) to the specified Flow Address.

  Payload:
  ```
  {
	"recipient": "0xafad45913fb07dba",
	"amount": 2.0
  }
  ```
    - Example:

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

    - Example:

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
    - Example:

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

## Etc

### Creating a new database migration:

```shell
npm run migrate:make
```
