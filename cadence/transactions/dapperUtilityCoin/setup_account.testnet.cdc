import FungibleToken from "../../contracts/FungibleToken.cdc"
import TokenForwarding from "../../contracts/TokenForwarding.cdc"
import DapperUtilityCoin from "../../contracts/DapperUtilityCoin.cdc"

// Setup Dapper Utility Coin for Dapper Wallet

transaction() {
    prepare(account: AuthAccount) {
        // For Dapper Wallet:
        // To receive the payment on-chain in DUC, the Storefront account must create a special resource called a Forwarder.
        // The Forwarder ensures that the Storefront is properly credited for purchases made by Dapper users.

        let dapper = getAccount(0x82ec283f88a62e65)
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
