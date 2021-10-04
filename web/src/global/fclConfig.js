import {config} from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

config()
  .put("app.detail.title", "Kitty Items")
  .put("env", publicConfig.chainEnv)
  .put("faucet", publicConfig.faucetAddress)
  .put("accessNode.api", publicConfig.flowAccessApiUrl)
  .put("challenge.handshake", publicConfig.walletDiscovery)
  .put("0xFungibleToken", publicConfig.contractFungibleToken)
  .put("0xNonFungibleToken", publicConfig.contractNonFungibleToken)
  .put("0xFUSD", publicConfig.contractFUSD)
  .put("0xNFTStorefront", publicConfig.contractNftStorefront)
  .put("0xKittyItems", publicConfig.contractKittyItems)
  .put("decoder.Type", val => val.staticType)
