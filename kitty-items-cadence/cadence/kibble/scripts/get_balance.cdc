// This script reads the balance field of an account's Kibble Balance

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import Kibble from 0xKIBBLE

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(Kibble.BalancePublicPath)!.borrow<&Kibble.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
