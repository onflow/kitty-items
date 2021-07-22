package test

import "regexp"

var (
	fungibleTokenAddressPlaceholder    = regexp.MustCompile(`"[^"\s].*/FungibleToken.cdc"`)
	kibbleAddressPlaceHolder           = regexp.MustCompile(`"[^"\s].*/Kibble.cdc"`)
	nonFungibleTokenAddressPlaceholder = regexp.MustCompile(`"[^"\s].*/NonFungibleToken.cdc"`)
	kittyItemsAddressPlaceHolder       = regexp.MustCompile(`"[^"\s].*/KittyItems.cdc"`)
	nftStorefrontPlaceholder           = regexp.MustCompile(`"[^"\s].*/NFTStorefront.cdc"`)
)
