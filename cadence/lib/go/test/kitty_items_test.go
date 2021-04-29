package test

import (
	"strings"
	"testing"

	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	emulator "github.com/onflow/flow-emulator"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"

	"github.com/stretchr/testify/assert"

	"github.com/onflow/flow-go-sdk"

	nft_contracts "github.com/onflow/flow-nft/lib/go/contracts"
)

const (
	kittyItemsRootPath                   = "../../.."
	kittyItemsKittyItemsPath             = kittyItemsRootPath + "/contracts/KittyItems.cdc"
	kittyItemsSetupAccountPath           = kittyItemsRootPath + "/transactions/setup_account.cdc"
	kittyItemsMintKittyItemPath          = kittyItemsRootPath + "/transactions/mint_kitty_item.cdc"
	kittyItemsTransferKittyItemPath      = kittyItemsRootPath + "/transactions/transfer_kitty_item.cdc"
	kittyItemsInspectKittyItemSupplyPath = kittyItemsRootPath + "/scripts/read_kitty_items_supply.cdc"
	kittyItemsInspectCollectionLenPath   = kittyItemsRootPath + "/scripts/read_collection_length.cdc"
	kittyItemsInspectCollectionIdsPath   = kittyItemsRootPath + "/scripts/read_collection_ids.cdc"

	typeID1 = 1000
	typeID2 = 2000
)

func KittyItemsDeployContracts(b *emulator.Blockchain, t *testing.T) (flow.Address, flow.Address, crypto.Signer) {
	accountKeys := test.AccountKeyGenerator()

	// Should be able to deploy a contract as a new account with no keys.
	nftCode := loadNonFungibleToken()
	nftAddr, err := b.CreateAccount(
		nil,
		[]sdktemplates.Contract{
			{
				Name:   "NonFungibleToken",
				Source: string(nftCode),
			},
		})
	if !assert.NoError(t, err) {
		t.Log(err.Error())
	}
	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// Should be able to deploy a contract as a new account with one key.
	kittyItemsAccountKey, kittyItemsSigner := accountKeys.NewWithSigner()
	kittyItemsCode := loadKittyItems(nftAddr.String())
	kittyItemsAddr, err := b.CreateAccount(
		[]*flow.AccountKey{kittyItemsAccountKey},
		[]sdktemplates.Contract{
			{
				Name:   "KittyItems",
				Source: string(kittyItemsCode),
			},
		})
	if !assert.NoError(t, err) {
		t.Log(err.Error())
	}
	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// Simplify the workflow by having the contract address also be our initial test collection.
	KittyItemsSetupAccount(t, b, kittyItemsAddr, kittyItemsSigner, nftAddr, kittyItemsAddr)

	return nftAddr, kittyItemsAddr, kittyItemsSigner
}

func KittyItemsSetupAccount(t *testing.T, b *emulator.Blockchain, userAddress sdk.Address, userSigner crypto.Signer, nftAddr sdk.Address, kittyItemsAddr sdk.Address) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateSetupAccountScript(nftAddr.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		false,
	)
}

func KittyItemsCreateAccount(t *testing.T, b *emulator.Blockchain, nftAddr sdk.Address, kittyItemsAddr sdk.Address) (sdk.Address, crypto.Signer) {
	userAddress, userSigner, _ := createAccount(t, b)
	KittyItemsSetupAccount(t, b, userAddress, userSigner, nftAddr, kittyItemsAddr)
	return userAddress, userSigner
}

func KittyItemsMintItem(b *emulator.Blockchain, t *testing.T, nftAddr, kittyItemsAddr flow.Address, kittyItemsSigner crypto.Signer, typeID uint64) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateMintKittyItemScript(nftAddr.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)
	tx.AddArgument(cadence.NewAddress(kittyItemsAddr))
	tx.AddArgument(cadence.NewUInt64(typeID))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kittyItemsAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kittyItemsSigner},
		false,
	)
}

func KittyItemsTransferItem(b *emulator.Blockchain, t *testing.T, nftAddr, kittyItemsAddr flow.Address, kittyItemsSigner crypto.Signer, typeID uint64, recipientAddr flow.Address, shouldFail bool) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateTransferKittyItemScript(nftAddr.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)
	tx.AddArgument(cadence.NewAddress(recipientAddr))
	tx.AddArgument(cadence.NewUInt64(typeID))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kittyItemsAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kittyItemsSigner},
		shouldFail,
	)
}

func TestKittyItemsDeployContracts(t *testing.T) {
	b := newEmulator()
	KittyItemsDeployContracts(b, t)
}

func TestCreateKittyItem(t *testing.T) {
	b := newEmulator()

	nftAddr, kittyItemsAddr, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	supply := executeScriptAndCheck(t, b, kittyItemsGenerateInspectKittyItemSupplyScript(nftAddr.String(), kittyItemsAddr.String()), nil)
	assert.Equal(t, cadence.NewUInt64(0), supply.(cadence.UInt64))

	len := executeScriptAndCheck(
		t,
		b,
		kittyItemsGenerateInspectCollectionLenScript(nftAddr.String(), kittyItemsAddr.String()),
		[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
	)
	assert.Equal(t, cadence.NewInt(0), len.(cadence.Int))

	t.Run("Should be able to mint a kittyItems", func(t *testing.T) {
		KittyItemsMintItem(b, t, nftAddr, kittyItemsAddr, kittyItemsSigner, typeID1)

		// Assert that the account's collection is correct
		len := executeScriptAndCheck(
			t,
			b,
			kittyItemsGenerateInspectCollectionLenScript(nftAddr.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
		)
		assert.Equal(t, cadence.NewInt(1), len.(cadence.Int))

		// Assert that the token type is correct
		/*typeID := executeScriptAndCheck(
			t,
			b,
			kittyItemsGenerateInspectKittyItemTypeIDScript(nftAddr.String(), kittyItemsAddr.String()),
			// Cheat: We know it's token ID 0
			[][]byte{jsoncdc.MustEncode(cadence.NewUInt64(0))},
		)
		assert.Equal(t, cadence.NewUInt64(typeID1), typeID.(cadence.UInt64))*/
	})

	/*t.Run("Shouldn't be able to borrow a reference to an NFT that doesn't exist", func(t *testing.T) {
		// Assert that the account's collection is correct
		result, err := b.ExecuteScript(kittyItemsGenerateInspectCollectionScript(nftAddr, kittyItemsAddr, kittyItemsAddr, "KittyItems", "KittyItemsCollection", 5), nil)
		require.NoError(t, err)
		assert.True(t, result.Reverted())
	})*/
}

func TestTransferNFT(t *testing.T) {
	b := newEmulator()

	nftAddr, kittyItemsAddr, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	userAddress, userSigner, _ := createAccount(t, b)

	// create a new Collection
	t.Run("Should be able to create a new empty NFT Collection", func(t *testing.T) {
		KittyItemsSetupAccount(t, b, userAddress, userSigner, nftAddr, kittyItemsAddr)

		len := executeScriptAndCheck(
			t,
			b, kittyItemsGenerateInspectCollectionLenScript(nftAddr.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(userAddress))},
		)
		assert.Equal(t, cadence.NewInt(0), len.(cadence.Int))

	})

	t.Run("Shouldn't be able to withdraw an NFT that doesn't exist in a collection", func(t *testing.T) {
		KittyItemsTransferItem(b, t, nftAddr, kittyItemsAddr, kittyItemsSigner, 3333333, userAddress, true)

		//executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, userAddress, "KittyItems", "KittyItemsCollection", 0))

		// Assert that the account's collection is correct
		//executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, kittyItemsAddr, "KittyItems", "KittyItemsCollection", 1))
	})

	// transfer an NFT
	t.Run("Should be able to withdraw an NFT and deposit to another accounts collection", func(t *testing.T) {
		KittyItemsMintItem(b, t, nftAddr, kittyItemsAddr, kittyItemsSigner, typeID1)
		// Cheat: we have minted one item, its ID will be zero
		KittyItemsTransferItem(b, t, nftAddr, kittyItemsAddr, kittyItemsSigner, 0, userAddress, false)

		// Assert that the account's collection is correct
		//executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionScript(nftAddr, kittyItemsAddr, userAddress, "KittyItems", "KittyItemsCollection", 0))

		//executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, userAddress, "KittyItems", "KittyItemsCollection", 1))

		// Assert that the account's collection is correct
		//executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, kittyItemsAddr, "KittyItems", "KittyItemsCollection", 0))
	})

	// transfer an NFT
	/*t.Run("Should be able to withdraw an NFT and destroy it, not reducing the supply", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kittyItemsGenerateDestroyScript(nftAddr, kittyItemsAddr, "KittyItems", "KittyItemsCollection", 0)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(userAddress)

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, userAddress},
			[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
			false,
		)

		executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, userAddress, "KittyItems", "KittyItemsCollection", 0))

		// Assert that the account's collection is correct
		executeScriptAndCheck(t, b, kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr, kittyItemsAddr, "KittyItems", "KittyItemsCollection", 0))

		executeScriptAndCheck(t, b, kittyItemsGenerateInspectNFTSupplyScript(nftAddr, kittyItemsAddr, "KittyItems", 1))

	})*/
}

func replaceKittyItemsAddressPlaceholders(code, nftAddress, kittyItemsAddress string) []byte {
	return []byte(replaceStrings(
		code,
		map[string]string{
			nftAddressPlaceholder:        "0x" + nftAddress,
			kittyItemsAddressPlaceHolder: "0x" + kittyItemsAddress,
		},
	))
}

func loadNonFungibleToken() []byte {
	return nft_contracts.NonFungibleToken()
}

func loadKittyItems(nftAddr string) []byte {
	return []byte(strings.ReplaceAll(
		string(readFile(kittyItemsKittyItemsPath)),
		nftAddressPlaceholder,
		"0x"+nftAddr,
	))
}

func kittyItemsGenerateSetupAccountScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsSetupAccountPath)),
		nftAddr,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateMintKittyItemScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsMintKittyItemPath)),
		nftAddr,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateTransferKittyItemScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsTransferKittyItemPath)),
		nftAddr,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateInspectKittyItemSupplyScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsInspectKittyItemSupplyPath)),
		nftAddr,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateInspectCollectionLenScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsInspectCollectionLenPath)),
		nftAddr,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateInspectCollectionIdsScript(nftAddr, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsInspectCollectionIdsPath)),
		nftAddr,
		kittyItemsAddr,
	)
}
