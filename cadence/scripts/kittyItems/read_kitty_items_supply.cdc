import KittyItems from "../../contracts/KittyItems.cdc"

// This scripts returns the number of KittyItems currently in existence.

pub fun main(): UInt64 {    
    return KittyItems.totalSupply
}
