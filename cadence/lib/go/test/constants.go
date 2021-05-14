package test

import "regexp"

var (
	ftAddressPlaceholder         = regexp.MustCompile(`"[^"\s].*/FungibleToken.cdc"`)
	kibbleAddressPlaceHolder     = regexp.MustCompile(`"[^"\s].*/Kibble.cdc"`)
	nftAddressPlaceholder        = regexp.MustCompile(`"[^"\s].*/NonFungibleToken.cdc"`)
	kittyItemsAddressPlaceHolder = regexp.MustCompile(`"[^"\s].*/KittyItems.cdc"`)
	kittyItemsMarketPlaceholder  = regexp.MustCompile(`"[^"\s].*/KittyItemsMarket.cdc"`)
)
