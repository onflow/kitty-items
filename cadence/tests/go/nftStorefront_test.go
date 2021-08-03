package test

import (
	"testing"

	"github.com/onflow/kitty-items/cadence/test/go/kibble"
	"github.com/onflow/kitty-items/cadence/test/go/kittyitems"
	"github.com/onflow/kitty-items/cadence/test/go/nftstorefront"
	"github.com/onflow/kitty-items/cadence/test/go/test"
)

func TestNFTStorefrontDeployContracts(t *testing.T) {
	b := test.NewBlockchain()

	nftstorefront.DeployContracts(t, b)
}

func TestNFTStorefrontSetupAccount(t *testing.T) {
	b := test.NewBlockchain()

	contracts := nftstorefront.DeployContracts(t, b)

	t.Run("Should be able to create an empty Storefront", func(t *testing.T) {
		userAddress, userSigner, _ := test.CreateAccount(t, b)
		nftstorefront.SetupAccount(t, b, userAddress, userSigner, contracts.NFTStorefrontAddress)
	})
}

func TestNFTStorefrontCreateSaleOffer(t *testing.T) {
	b := test.NewBlockchain()

	contracts := nftstorefront.DeployContracts(t, b)

	t.Run("Should be able to create a sale offer and list it", func(t *testing.T) {
		tokenToList := uint64(0)
		tokenPrice := "1.11"
		userAddress, userSigner := nftstorefront.CreateAccount(t, b, contracts)

		// contract mints item
		kittyitems.MintItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID,
		)

		// contract transfers item to another seller account (we don't need to do this)
		kittyitems.TransferItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		nftstorefront.ListItem(
			t, b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)
	})

	t.Run("Should be able to accept a sale offer", func(t *testing.T) {
		tokenToList := uint64(1)
		tokenPrice := "1.11"
		userAddress, userSigner := nftstorefront.CreateAccount(t, b, contracts)

		// contract mints item
		kittyitems.MintItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID,
		)

		// contract transfers item to another seller account (we don't need to do this)
		kittyitems.TransferItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		saleOfferResourceID := nftstorefront.ListItem(
			t, b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)

		buyerAddress, buyerSigner := nftstorefront.CreatePurchaserAccount(t, b, contracts)

		// fund the purchase
		kibble.Mint(
			t, b,
			contracts.FungibleTokenAddress,
			contracts.KibbleAddress,
			contracts.KibbleSigner,
			buyerAddress,
			"100.0",
			false,
		)

		// Make the purchase
		nftstorefront.PurchaseItem(
			t, b,
			contracts,
			buyerAddress,
			buyerSigner,
			userAddress,
			saleOfferResourceID,
			false,
		)
	})

	t.Run("Should be able to remove a sale offer", func(t *testing.T) {
		tokenToList := uint64(2)
		tokenPrice := "1.11"
		userAddress, userSigner := nftstorefront.CreateAccount(t, b, contracts)

		// contract mints item
		kittyitems.MintItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID,
		)

		// contract transfers item to another seller account (we don't need to do this)
		kittyitems.TransferItem(
			t, b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		saleOfferResourceID := nftstorefront.ListItem(
			t, b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)

		// make the purchase
		nftstorefront.RemoveItem(
			t, b,
			contracts,
			userAddress,
			userSigner,
			saleOfferResourceID,
			false,
		)
	})
}
