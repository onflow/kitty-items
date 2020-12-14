// This script reads the total supply field
// of the Kibble smart contract

import Kibble from 0xKIBBLE

pub fun main(): UFix64 {

    let supply = Kibble.totalSupply

    log(supply)

    return supply
}