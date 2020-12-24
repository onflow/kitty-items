import KittyItems from 0xKITTYITEMS

// This transaction gets the number of KittyItems currently in existence

pub fun main(): UInt64 {    
    return KittyItems.totalSupply
}
 