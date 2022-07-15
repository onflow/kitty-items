# Kitty Items API
The Kitty Items API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/fcl-js/tree/master/packages/sdk). It contains endpoints for both the [kitty-items](src/services/kitty-items.ts) & [storefront](src/services/storefront.ts) services to read & write data from both the Flow blockchain as well as a SQL DB.

## Services
Kitty Items uses main 4 services to function. These services are used to maintain data integrity between the blockchain & our database as well as allow avenues for users to interact with our data through exposed api endpoints. 

### [Flow Service](src/services/flow.ts)
This service contains functions that interact with the Flow blockchain using the [onflow/fcl](https://docs.onflow.org/fcl/) package. While it has no exposed endpoints, the methods here used to read, write & authorize data on the chain are used extensively in its sister services & workers.

Notable functions:
- `sendTx()`: Takes a Cadence transaction as an arguement and sends it to write data into the Flow blockchain.
- `executeScript()`: Takes a Cadence script as an arguement and executes it to read data from the Flow blockchain. 
- `getLatestBlockHeight()`: Gets the most recent block from the Flow blockchain.
- `authorizeMinter()`: Returns an asynchronous method to authorize an account to mint Kitty Items.

### [Block-cursor Service](src/services/block-cursor.ts)
This service contains functions that read & write data to the SQL database to maintain the Kitty Items Marketplace

Notable functions:
- `findOrCreateLatestBlockCursor()`: Queries the `block_cursor` table for the the last block check by the listing handler worker. If no row is found then insert a record with our current latest block height.
- `updateBlockCursorById()`: Updates the row with the latest block height that has been checked for events.

### [Kitty-items Service](src/services/kitty-items.ts)
This service contains functions that utilize the Flow Service to send/execute transactions/scripts that fetch/manipulate Kitty Items data. These functions are exposed through endpoints to allow users to read & manipulate Kitty Items data on the chain. The Cadence scripts/transactions can also be called in the [Flow-cli](https://docs.onflow.org/flow-cli/) and directly read/write to the Flow blockchain.

[Exposed Endpoints](src/routes/kitty-items.ts):
- **POST `/v1/kitty-items/setup`** *[DEPRECATED]*: Sets up account with a resource that stores Kitty Items in the admin minter account. The [startup script](/.ki-scripts/startup.js) directly sends the setup Cadence transaction instead of using this endpoint. Calls [setup_account.cdc](/cadence/transactions/kittyItems/setup_account.cdc)

- **POST `/v1/kitty-items/mint`** *[DEPRECATED]*: Mint a Kitty Item and send it to a recipient account. Calls [mint_kitty_item.cdc](/cadence/transactions/kittyItems/mint_kitty_item.cdc)

- **POST `/v1/kitty-items/mint-and-list`**: Mint a Kitty Item and send it to a recipient account. Create a listing to sell the Kitty Item immediately after. Called by the admin service account to mint & list items onto the store. Calls [mint_and_list_kitty_item.cdc](/cadence/transactions/kittyItems/mint_and_list_kitty_item.cdc)

- **POST `/v1/kitty-items/transfer`**: Sends a Kitty Item from account to recipient account. Calls [transfer_kitty_item.cdc](/cadence/transactions/kittyItems/transfer_kitty_item.cdc)

- **GET `/v1/kitty-items/collection/:account`**: Fetches a collection of Kitty Item IDs for an account. Calls [get_collection_ids.cdc](/cadence/scripts/kittyItems/get_collection_ids.cdc)

- **GET `/v1/kitty-items/item/:address/:itemID`**: Fetches a specific Kitty Item for an account. Calls [get_kitty_item.cdc](/cadence/scripts/kittyItems/get_kitty_item.cdc)

- **GET `/v1/kitty-items/supply`**: Fetches the total supply of Kitty Items. Calls [get_kitty_items_supply.cdc](/cadence/scripts/kittyItems/get_kitty_items_supply.cdc).

### [Storefront Service](src/services/storefront.ts)
This service contains functions that read & write Kitty Items listing data to both the Flow blockchain as well as the SQL database. These functions are exposed through endpoints to allow users to purchase & list their Kitty Items on the marketplace. Similar to the Kitty Items service, the Cadence scripts/transactions can be called in the [Flow-cli](https://docs.onflow.org/flow-cli/) and directly read/write to the Flow blockchain.

[Exposed Endpoints](src/routes/storefront.ts):
- **POST `/v1/market/setup`** *[DEPRECATED]*: Sets up account with a resource that stores listings for Kitty Items in the admin account. The [startup script](/.ki-scripts/startup.js) directly sends the setup Cadence transaction instead of using this endpoint. Calls [setup_account.cdc](/cadence/transactions/nftStorefront/setup_account.cdc)

- **POST `/v1/market/buy`**: Takes payment and transfers KittyItem from seller account to recipient. Calls [purchase_listing.cdc](/cadence/transactions/nftStorefront/purchase_listing.cdc)

- **POST `/v1/market/sell`**: Creates Kitty Items listing on the Flow blockchain. **Kitty Items that associated to listings are not removed from the seller's account until item is purchased**. Calls [create_listing.cdc](/cadence/transactions/nftStorefront/create_listing.cdc)

- **GET `/v1/market/collection/:account`**: Fetches all the listings created by the account. Returns an array of `listing_resource_ids`. Calls [get_listings.cdc](/cadence/scripts/nftStorefront/get_listings.cdc)

- **GET `/v1/market/collection/:account/:item`**: Fetches a specific listing for account and itemID. Calls [get_listing.cdc](/cadence/scripts/nftStorefront/get_listing.cdc)

- **GET `/v1/market/latest`**: Queries the `listings` table with different parameters to fetch an array of listings in order of recency. Returns an array of listings.

- **GET `/v1/market/:id`**: Queries the `listings` table to fetch a specific `itemID`. Returns a specific listing.

## Database
>I thought Kitty Items were NFTs that exist on the blockchain. Why do we need a database?

While a DB is not necessary to purchase, sell, & mint Kitty Items, it greatly reduces the number of queries executed against the blockchain, creating a much more performant app! Since Kitty Items listings are tied to the account that owns the Kitty Item up for sale, we would need to query the blockchain for all accounts that have created Kitty Item listings in order to create a collection of listings we could call a marketplace. Saving the listings in a database and updating the table when listings are created & deleted greatly reduces the number of calls needed to fetch accurate listing data.

### Tables
- **[listings](src/migrations/20201217175722_create_listings.ts)**: This table is used to store all listings on the marketplace and storefront. The difference between Storefront & Marketplace is that Kitty Items listed by users are considered Marketplace listings & the items listed by the admin service account and considered Storefront listings.
- **[block_cursor](src/migrations/20201214150404_create_block_cursor.ts )**: This table is used to record the last visited block on the Flow blockain. Workers use & update this row when checking the blockchain for listing events.

## Workers
In order to ensure the listing data in the database is consistent with the data on the blockchain, we must run a event handler worker that periodically checks windows of blocks on the Flow blockchain for listing events. When we come across a listing event, the handler will run a query to update the database to be consistant with the blockchain.

- **[base_event_handler](src/workers/base-event-handler.ts)**: This is an abstract class contains the logic to poll the blockchain for events we want to action on. The polling function first queries the blockchain & database to create a block search window. Then it queries the blockchain again for relevant events within the computed search window. Once the search is complete, the last seen block height is recorded in the database and the method recursively calls itself to continue polling.

- **[listing_handler.ts](src/workers/listing-handler.ts)**: This handler extends the base_event_handler and defines the listing events we want to check for. It also contains the `onEvent()` business logic to be ran when a listing event is found.