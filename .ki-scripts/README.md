# Kitty Items Scripts

This directory contains Javascript scripts for initializing the Kitty Items application.

## Version Check

A script that compares the current process's Node version against the [package.json](/package.json) Node engine requirement. This script can be executed by running `npm run preinstall`

## Startup

This script is called when deploying both local & testnet versions of the Kitty Items application. Multiple processes are executed to initialize both the database as well as an admin service account required for the application to function.

### Begin Process
The script begins by ending all running processes from previously runs of the script.

### Check for correct Node version
In this step, the script checks the process's Node version against the Node engine requirement in the root [package.json](/package.json). Similar to [version-check.js](/.ki-scripts/version-check.js).

### Testnet account creation (`bootstrapNewTestnetAccount()`)
This section defines the function that begins the process of creating a new Testnet account for applications that connect to and run Cadence on testnet. This account becomes the admin service account that eventually mints your Kitty Items on Testnet.

### Contract deployment (`deployAndInitialize()`)
This section defines the function that begins the process of deploying the required cadence contracts to the admin service account. The contracts being deployed can be found in [flow.json](/flow.json).

- **Initialize Kitty Items**: This step executes the [setup_account.cdc](/cadence/transactions/kittyItems/setup_account.cdc) transaction and initializes the admin service account with the resources required to mint & transfer Kitty Items.

- **Initialize NFTStorefrontV2**: This step executes the [setup_account.cdc](/cadence/transactions/nftStorefront/setup_account.cdc) transaction and initializes the admin service account with the resources required to create Kitty Item listings on the marketplace.

### Emulator environment startup
This process initializes the Flow emulator which starts a local instance of the Flow blockchain protocol to develop against. The emulator will also initialize an instance of the [FCL Dev Wallet](https://github.com/onflow/fcl-dev-wallet). Once the processes are running, the script will execute the `Contract deployment` steps to set up the admin service account.

### Testnet environment startup
This process prompts the user to use an existing configuration for the admin service account. If the user chooses not to use an existing testnet account or if no account exists, the script  will prompt the user to create a new account through the `Testnet account creation` process. The process will then execute the `Contract deployment` steps to setup the new admin service account. If the user opted to use an existing testnet service account, no initialization is required.

### Services Startup
This process initializes the Kitty Items API server & Web application. 

You learn more about them here:
- [Kitty Items API](/api/README.md)
- [Kitty Items Web](/web/README.md)

### Done
Once all processes have completed, the application will be running live on testnet or locally depending on your environment arguements. Here, the user can opt to view logs in the terminal as the application is running. 

## Reset
TBA

