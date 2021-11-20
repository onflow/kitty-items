const isDev = process.env.NODE_ENV === "development"

const chainEnv = process.env.NEXT_PUBLIC_CHAIN_ENV
if (!chainEnv) throw "Missing NEXT_PUBLIC_CHAIN_ENV"

const flowAccessApiUrl = process.env.NEXT_PUBLIC_FLOW_ACCESS_API_URL
if (!flowAccessApiUrl) throw "Missing NEXT_PUBLIC_FLOW_ACCESS_API_URL"

const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (!appUrl) throw "Missing NEXT_PUBLIC_APP_URL"

const walletDiscovery = process.env.NEXT_PUBLIC_WALLET_DISCOVERY
if (!walletDiscovery) throw "Missing NEXT_PUBLIC_WALLET_DISCOVERY"

const apiKibbleMint = process.env.NEXT_PUBLIC_API_KIBBLE_MINT
if (!apiKibbleMint) throw "Missing NEXT_PUBLIC_API_KIBBLE_MINT"

const apiFUSDMint = process.env.NEXT_PUBLIC_API_FUSD_MINT
if (!apiFUSDMint) throw "Missing NEXT_PUBLIC_API_FUSD_MINT"

const apiKittyItemMint = process.env.NEXT_PUBLIC_API_KITTY_ITEM_MINT
if (!apiKittyItemMint) throw "Missing NEXT_PUBLIC_API_KITTY_ITEM_MINT"

const apiKittyItemMintAndList =
  process.env.NEXT_PUBLIC_API_KITTY_ITEM_MINT_AND_LIST
if (!apiKittyItemMintAndList)
  throw "Missing NEXT_PUBLIC_API_KITTY_ITEM_MINT_AND_LIST"

const apiMarketItemsList = process.env.NEXT_PUBLIC_API_MARKET_ITEMS_LIST
if (!apiMarketItemsList) throw "Missing NEXT_PUBLIC_API_MARKET_ITEMS_LIST"

const apiUrl = process.env.NEXT_PUBLIC_API_URL
if (!apiUrl) throw "Missing NEXT_PUBLIC_API_URL"

const contractFungibleToken = process.env.NEXT_PUBLIC_CONTRACT_FUNGIBLE_TOKEN
if (!contractFungibleToken) throw "Missing NEXT_PUBLIC_CONTRACT_FUNGIBLE_TOKEN"

const contractNonFungibleToken =
  process.env.NEXT_PUBLIC_CONTRACT_NON_FUNGIBLE_TOKEN
if (!contractNonFungibleToken)
  throw "Missing NEXT_PUBLIC_CONTRACT_NON_FUNGIBLE_TOKEN"

const flowAddress = process.env.NEXT_PUBLIC_FLOW_ADDRESS
if (!flowAddress) throw "Missing NEXT_PUBLIC_FLOW_ADDRESS"

const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL
if (!avatarUrl) throw "Missing NEXT_PUBLIC_AVATAR_URL"

const contractFUSD = process.env.NEXT_PUBLIC_CONTRACT_FUSD
if (!contractFUSD) throw "Missing NEXT_PUBLIC_CONTRACT_FUSD"

const contractKibble = process.env.NEXT_PUBLIC_CONTRACT_KIBBLE
if (!contractKibble) throw "Missing NEXT_PUBLIC_CONTRACT_KIBBLE"

const contractKittyItems = process.env.NEXT_PUBLIC_CONTRACT_KITTY_ITEMS
if (!contractKittyItems) throw "Missing NEXT_PUBLIC_CONTRACT_KITTY_ITEMS"

const contractNftStorefront = process.env.NEXT_PUBLIC_CONTRACT_NFT_STOREFRONT
if (!contractNftStorefront) throw "Missing NEXT_PUBLIC_CONTRACT_NFT_STOREFRONT"

const publicConfig = {
  isDev,
  faucetAddress: process.env.NEXT_PUBLIC_FAUCET_ADDRESS,
  chainEnv,
  flowAccessApiUrl,
  appUrl,
  walletDiscovery,
  apiKibbleMint,
  apiFUSDMint,
  apiKittyItemMint,
  apiMarketItemsList,
  apiKittyItemMintAndList,
  apiUrl,
  flowAddress,
  avatarUrl,
  contractFungibleToken,
  contractNonFungibleToken,
  contractFUSD,
  contractKibble,
  contractKittyItems,
  contractNftStorefront,
}

export default publicConfig
