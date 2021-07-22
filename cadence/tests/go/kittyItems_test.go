package test

import (
	"regexp"
	"testing"

	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	emulator "github.com/onflow/flow-emulator"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/onflow/flow-go-sdk"

	nft_contracts "github.com/onflow/flow-nft/lib/go/contracts"
)

const (
	kittyItemsTransactionsRootPath = "../../../transactions/kittyItems"
	kittyItemsScriptsRootPath      = "../../../scripts/kittyItems"

	kittyItemsContractPath               = "../../../contracts/KittyItems.cdc"
	kittyItemsSetupAccountPath           = kittyItemsTransactionsRootPath + "/setup_account.cdc"
	kittyItemsMintKittyItemPath          = kittyItemsTransactionsRootPath + "/mint_kitty_item.cdc"
	kittyItemsTransferKittyItemPath      = kittyItemsTransactionsRootPath + "/transfer_kitty_item.cdc"
	kittyItemsInspectKittyItemSupplyPath = kittyItemsScriptsRootPath + "/get_kitty_items_supply.cdc"
	kittyItemsInspectCollectionLenPath   = kittyItemsScriptsRootPath + "/get_collection_length.cdc"

	typeID = 1000
)

func KittyItemsDeployContracts(b *emulator.Blockchain, t *testing.T) (flow.Address, flow.Address, crypto.Signer) {
	accountKeys := test.AccountKeyGenerator()

	// should be able to deploy a contract as a new account with no keys
	nftCode := loadNonFungibleToken()
	nftAddress, err := b.CreateAccount(
		nil,
		[]sdktemplates.Contract{
			{
				Name:   "NonFungibleToken",
				Source: string(nftCode),
			},
		},
	)
	require.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// should be able to deploy a contract as a new account with one key
	kittyItemsAccountKey, kittyItemsSigner := accountKeys.NewWithSigner()
	kittyItemsCode := loadKittyItems(nftAddress.String())
	kittyItemsAddr, err := b.CreateAccount(
		[]*flow.AccountKey{kittyItemsAccountKey},
		[]sdktemplates.Contract{
			{
				Name:   "KittyItems",
				Source: string(kittyItemsCode),
			},
		},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// simplify the workflow by having the contract address also be our initial test collection
	KittyItemsSetupAccount(t, b, kittyItemsAddr, kittyItemsSigner, nftAddress, kittyItemsAddr)

	return nftAddress, kittyItemsAddr, kittyItemsSigner
}

func KittyItemsSetupAccount(
	t *testing.T, b *emulator.Blockchain,
	userAddress sdk.Address, userSigner crypto.Signer, nftAddress sdk.Address, kittyItemsAddr sdk.Address,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateSetupAccountScript(nftAddress.String(), kittyItemsAddr.String())).
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

func KittyItemsMintItem(
	t *testing.T, b *emulator.Blockchain,
	nftAddress, kittyItemsAddr flow.Address,
	kittyItemsSigner crypto.Signer, typeID uint64,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateMintKittyItemScript(nftAddress.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)

	_ = tx.AddArgument(cadence.NewAddress(kittyItemsAddr))
	_ = tx.AddArgument(cadence.NewUInt64(typeID))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kittyItemsAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kittyItemsSigner},
		false,
	)
}

func KittyItemsTransferItem(
	t *testing.T, b *emulator.Blockchain,
	nftAddress, kittyItemsAddr flow.Address, kittyItemsSigner crypto.Signer,
	typeID uint64, recipientAddr flow.Address, shouldFail bool,
) {

	tx := flow.NewTransaction().
		SetScript(kittyItemsGenerateTransferKittyItemScript(nftAddress.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)

	_ = tx.AddArgument(cadence.NewAddress(recipientAddr))
	_ = tx.AddArgument(cadence.NewUInt64(typeID))

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

	nftAddress, kittyItemsAddr, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	supply := executeScriptAndCheck(
		t, b,
		kittyItemsGenerateInspectKittyItemSupplyScript(nftAddress.String(), kittyItemsAddr.String()),
		nil,
	)
	assert.EqualValues(t, cadence.NewUInt64(0), supply)

	// assert that the account collection is empty
	length := executeScriptAndCheck(
		t,
		b,
		kittyItemsGenerateInspectCollectionLenScript(nftAddress.String(), kittyItemsAddr.String()),
		[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
	)
	assert.EqualValues(t, cadence.NewInt(0), length)

	t.Run("Should be able to mint a kittyItems", func(t *testing.T) {
		KittyItemsMintItem(t, b, nftAddress, kittyItemsAddr, kittyItemsSigner, typeID)

		// assert that the account collection is correct length
		length = executeScriptAndCheck(
			t,
			b,
			kittyItemsGenerateInspectCollectionLenScript(nftAddress.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(kittyItemsAddr))},
		)
		assert.EqualValues(t, cadence.NewInt(1), length)
	})
}

func TestTransferNFT(t *testing.T) {
	b := newEmulator()

	nftAddress, kittyItemsAddr, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	userAddress, userSigner, _ := createAccount(t, b)

	// create a new Collection
	t.Run("Should be able to create a new empty NFT Collection", func(t *testing.T) {
		KittyItemsSetupAccount(t, b, userAddress, userSigner, nftAddress, kittyItemsAddr)

		length := executeScriptAndCheck(
			t,
			b, kittyItemsGenerateInspectCollectionLenScript(nftAddress.String(), kittyItemsAddr.String()),
			[][]byte{jsoncdc.MustEncode(cadence.NewAddress(userAddress))},
		)
		assert.EqualValues(t, cadence.NewInt(0), length)
	})

	t.Run("Shouldn not be able to withdraw an NFT that does not exist in a collection", func(t *testing.T) {
		nonExistentID := uint64(3333333)

		KittyItemsTransferItem(
			t, b,
			nftAddress, kittyItemsAddr, kittyItemsSigner,
			nonExistentID, userAddress, true,
		)
	})

	// transfer an NFT
	t.Run("Should be able to withdraw an NFT and deposit to another accounts collection", func(t *testing.T) {
		KittyItemsMintItem(t, b, nftAddress, kittyItemsAddr, kittyItemsSigner, typeID)
		// Cheat: we have minted one item, its ID will be zero
		KittyItemsTransferItem(t, b, nftAddress, kittyItemsAddr, kittyItemsSigner, 0, userAddress, false)
	})
}

func replaceKittyItemsAddressPlaceholders(code, nftAddress, kittyItemsAddress string) []byte {
	return []byte(replaceImports(
		code,
		map[string]*regexp.Regexp{
			nftAddress:        nonFungibleTokenAddressPlaceholder,
			kittyItemsAddress: kittyItemsAddressPlaceHolder,
		},
	))
}

func loadNonFungibleToken() []byte {
	return nft_contracts.NonFungibleToken()
}

func loadKittyItems(nftAddress string) []byte {
	return []byte(replaceImports(
		string(readFile(kittyItemsContractPath)),
		map[string]*regexp.Regexp{
			nftAddress: nonFungibleTokenAddressPlaceholder,
		},
	))
}

func kittyItemsGenerateSetupAccountScript(nftAddress, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsSetupAccountPath)),
		nftAddress,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateMintKittyItemScript(nftAddress, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsMintKittyItemPath)),
		nftAddress,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateTransferKittyItemScript(nftAddress, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsTransferKittyItemPath)),
		nftAddress,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateInspectKittyItemSupplyScript(nftAddress, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsInspectKittyItemSupplyPath)),
		nftAddress,
		kittyItemsAddr,
	)
}

func kittyItemsGenerateInspectCollectionLenScript(nftAddress, kittyItemsAddr string) []byte {
	return replaceKittyItemsAddressPlaceholders(
		string(readFile(kittyItemsInspectCollectionLenPath)),
		nftAddress,
		kittyItemsAddr,
	)
}
