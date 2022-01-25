import {config} from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

config()
  .put("app.detail.title", "Kitty Items")
  .put(
    "app.detail.icon",
    `${new URL(publicConfig.appUrl).origin}/images/kitty-items-logo.svg`
  )
  .put("env", publicConfig.chainEnv)
  .put("faucet", publicConfig.faucetAddress)
  .put("accessNode.api", publicConfig.flowAccessApiUrl)
  .put("challenge.handshake", publicConfig.walletDiscovery)
  .put("0xFungibleToken", publicConfig.contractFungibleToken)
  .put("0xNonFungibleToken", publicConfig.contractNonFungibleToken)
  .put("0xMetadataViews", publicConfig.contractMetadataViews)
  .put("0xFlowToken", publicConfig.contractFlowToken)
  .put("0xNFTStorefront", publicConfig.contractNftStorefront)
  .put("0xKittyItems", publicConfig.contractKittyItems)
