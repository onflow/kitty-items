import FungibleToken from "../../contracts/FungibleToken.cdc"
import Kibble from "../../contracts/Kibble.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the Kibble

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath) == nil {
            // Create a new Kibble Vault and put it in storage
            signer.save(<-Kibble.createEmptyVault(), to: Kibble.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&Kibble.Vault{FungibleToken.Receiver}>(
                Kibble.ReceiverPublicPath,
                target: Kibble.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&Kibble.Vault{FungibleToken.Balance}>(
                Kibble.BalancePublicPath,
                target: Kibble.VaultStoragePath
            )
        }
    }
}
