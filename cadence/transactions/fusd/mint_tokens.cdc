import FungibleToken from "../../contracts/FungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &FUSD.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(minterAccount: AuthAccount) {
        self.tokenMinter = minterAccount
            .borrow<&FUSD.MinterProxy>(from: FUSD.MinterProxyStoragePath)
            ?? panic("No minter available")

        self.tokenReceiver = getAccount(to)
            .getCapability(/public/fusdReceiver)!
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let mintedVault <- self.tokenMinter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)
    }
}
