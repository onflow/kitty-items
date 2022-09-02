import NFTStorefront from "../../contracts/NFTStorefront.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"
import TokenForwarding from "../../contracts/TokenForwarding.cdc"
import DapperUtilityCoin from "../../contracts/DapperUtilityCoin.cdc"

// This transaction installs the Storefront ressource in an account.

transaction {
    prepare(account: AuthAccount) {

        // If the account doesn't already have a Storefront
        if account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {

            // Create a new empty .Storefront
            let storefront <- NFTStorefront.createStorefront()
            
            // save it to the account
            account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

            // create a public capability for the .Storefront
            account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }

        // For Dapper Wallet:
        // To receive the payment on-chain in DUC, the Storefront account must create a special resource called a Forwarder.
        // The Forwarder ensures that the Storefront is properly credited for purchases made by Dapper users.

        let dapper = getAccount(0x82ec283f88a62e65) // TODO: emulator? service account. testnet (0x82ec283f88a62e65) vs mainnet account (0xead892083b3e2c6c)
        let dapperDUCReceiver = dapper.getCapability(/public/dapperUtilityCoinReceiver)!

        // Create a new Forwarder resource for DUC and store it in the new account's storage
        let ducForwarder <- TokenForwarding.createNewForwarder(recipient: dapperDUCReceiver)
        account.save(<-ducForwarder, to: /storage/dapperUtilityCoinReceiver)

        // Publish a Receiver capability for the new account, which is linked to the DUC Forwarder
        account.link<&{FungibleToken.Receiver}>(
            /public/dapperUtilityCoinReceiver,
            target: /storage/dapperUtilityCoinReceiver
        )
    }
}
