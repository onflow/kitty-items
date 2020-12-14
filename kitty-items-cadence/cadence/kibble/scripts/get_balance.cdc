// This script reads the balance field of an account's FlowToken Balance

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import Kibble from 0xKIBBLE

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(/public/KibbleBalance)!.borrow<&Kibble.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
