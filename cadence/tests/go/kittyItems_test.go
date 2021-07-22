package test

import (
	"testing"

	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	"github.com/stretchr/testify/assert"

	"github.com/onflow/kitty-items/cadence/test/go/kittyitems"
	"github.com/onflow/kitty-items/cadence/test/go/test"
)

const typeID = 1000

func TestKittyItemsDeployContracts(t *testing.T) {
	b := test.NewBlockchain()
	kittyitems.DeployContracts(t, b)
}

func TestCreateKittyItem(t *testing.T) {
	b := test.NewBlockchain()

	nftAddress, kittyItemsAddr, kittyItemsSigner := kittyitems.DeployContracts(t, b)

	supply := test.ExecuteScriptAndCheck(
		t, b,
		kittyitems.GetKittyItemSupplyScript(nftAddress.String(), kittyItemsAddr.String()),
		nil,
	)
	assert.EqualValues(t, cadence.NewUInt64(0), supply)

	// assert that the account collection is empty
	length := test.ExecuteScriptAndCheck(
		t, b,
		kittyitems.GetCollectionLengthScript(nftAddress.String(), kittyItemsAddr.String()),
		[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
	)
	assert.EqualValues(t, cadence.NewInt(0), length)

	t.Run("Should be able to mint a kittyItems", func(t *testing.T) {
		kittyitems.MintItem(t, b, nftAddress, kittyItemsAddr, kittyItemsSigner, typeID)

		// assert that the account collection is correct length
		length = test.ExecuteScriptAndCheck(
			t, b,
			kittyitems.GetCollectionLengthScript(nftAddress.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
		)
		assert.EqualValues(t, cadence.NewInt(1), length)
	})
}

func TestTransferNFT(t *testing.T) {
	b := test.NewBlockchain()

	nftAddress, kittyItemsAddr, kittyItemsSigner := kittyitems.DeployContracts(t, b)

	userAddress, userSigner, _ := test.CreateAccount(t, b)

	// create a new Collection
	t.Run("Should be able to create a new empty NFT Collection", func(t *testing.T) {
		kittyitems.SetupAccount(t, b, userAddress, userSigner, nftAddress, kittyItemsAddr)

		length := test.ExecuteScriptAndCheck(
			t, b,
			kittyitems.GetCollectionLengthScript(nftAddress.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(userAddress))},
		)
		assert.EqualValues(t, cadence.NewInt(0), length)
	})

	t.Run("Should not be able to withdraw an NFT that does not exist in a collection", func(t *testing.T) {
		nonExistentID := uint64(3333333)

		kittyitems.TransferItem(
			t, b,
			nftAddress, kittyItemsAddr, kittyItemsSigner,
			nonExistentID, userAddress, true,
		)
	})

	// transfer an NFT
	t.Run("Should be able to withdraw an NFT and deposit to another accounts collection", func(t *testing.T) {
		kittyitems.MintItem(t, b, nftAddress, kittyItemsAddr, kittyItemsSigner, typeID)
		// Cheat: we have minted one item, its ID will be zero
		kittyitems.TransferItem(
			t, b,
			nftAddress, kittyItemsAddr, kittyItemsSigner,
			0, userAddress, false,
		)
	})
}
