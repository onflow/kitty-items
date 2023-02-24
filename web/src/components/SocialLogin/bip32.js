import {BIP32Factory} from "bip32"

/**
 * Note that we intentionally hardcoded the version of "tiny-secp256k1" to "1.1.6"
 * as the higher version (2.2.0) resulted in a blank page apparently
 * stuck in an infinite loop.
 */
import * as ecc from "tiny-secp256k1"

export const bip32 = BIP32Factory(ecc)
