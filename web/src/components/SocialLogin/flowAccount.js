import {ec as EC} from "elliptic"
import {mnemonicToSeed} from "bip39"
import {getAccountInfo} from "./flowportApi"
import {bip32} from "./bip32"

const seedToKeyPair = rootSeed => {
  const secp256k1 = new EC("secp256k1")
  const path = `m/44'/539'/0'/0/0` // bip44 path
  const rootNode = bip32.fromSeed(Buffer.from(rootSeed, "hex"))
  const child = rootNode.derivePath(path)

  return {
    privateKey: child.privateKey.toString("hex"),
    publicKey: secp256k1
      .keyFromPublic(child.publicKey)
      .getPublic()
      .encode("hex", false)
      .slice(2),
  }
}

export const getAccountData = async mnemonic => {
  const seed = await mnemonicToSeed(mnemonic)
  console.log(seed)
  const {publicKey, privateKey} = seedToKeyPair(
    Buffer.from(seed).toString("hex")
  )

  return {
    publicKey,
    privateKey,
    address: (await getAccountInfo(publicKey)).address ?? null,
  }
}
