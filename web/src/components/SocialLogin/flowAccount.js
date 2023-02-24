import {ec as EC} from "elliptic"
import {mnemonicToSeed} from "bip39"
import {bip32} from "./bip32"
import {getAccountAddress, ensureAccountIsCreatedOnChain} from "./flowportApi"

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
  const {publicKey, privateKey} = seedToKeyPair(
    Buffer.from(seed).toString("hex")
  )
  console.log("getAccountData:publicKey", {publicKey})
  console.log("getAccountData:privateKey", {privateKey})

  await ensureAccountIsCreatedOnChain(publicKey)

  return {
    publicKey,
    privateKey,
    address: (await getAccountAddress(publicKey)) ?? null,
  }
}
