package kittyitems

import (
	"regexp"
	"testing"

	"github.com/onflow/cadence"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	sdktest "github.com/onflow/flow-go-sdk/test"
	nftcontracts "github.com/onflow/flow-nft/lib/go/contracts"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/onflow/kitty-items/cadence/test/go/test"
)

const (
	kittyItemsTransactionsRootPath = "../../transactions/kittyItems"
	kittyItemsScriptsRootPath      = "../../scripts/kittyItems"

	kittyItemsContractPath            = "../../contracts/KittyItems.cdc"
	kittyItemsSetupAccountPath        = kittyItemsTransactionsRootPath + "/setup_account.cdc"
	kittyItemsMintKittyItemPath       = kittyItemsTransactionsRootPath + "/mint_kitty_item.cdc"
	kittyItemsTransferKittyItemPath   = kittyItemsTransactionsRootPath + "/transfer_kitty_item.cdc"
	kittyItemsGetKittyItemSupplyPath  = kittyItemsScriptsRootPath + "/get_kitty_items_supply.cdc"
	kittyItemsGetCollectionLengthPath = kittyItemsScriptsRootPath + "/get_collection_length.cdc"
)

func DeployContracts(
	t *testing.T,
	b *emulator.Blockchain,
) (flow.Address, flow.Address, crypto.Signer) {
	accountKeys := sdktest.AccountKeyGenerator()

	// should be able to deploy a contract as a new account with no keys
	nftCode := nftcontracts.NonFungibleToken()
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
	SetupAccount(t, b, kittyItemsAddr, kittyItemsSigner, nftAddress, kittyItemsAddr)

	return nftAddress, kittyItemsAddr, kittyItemsSigner
}

func SetupAccount(
	t *testing.T,
	b *emulator.Blockchain,
	userAddress flow.Address,
	userSigner crypto.Signer,
	nftAddress flow.Address,
	kittyItemsAddress flow.Address,
) {
	tx := flow.NewTransaction().
		SetScript(SetupAccountScript(nftAddress.String(), kittyItemsAddress.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		false,
	)
}

func MintItem(
	t *testing.T, b *emulator.Blockchain,
	nftAddress, kittyItemsAddr flow.Address,
	kittyItemsSigner crypto.Signer, typeID uint64,
) {
	tx := flow.NewTransaction().
		SetScript(MintKittyItemScript(nftAddress.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)

	_ = tx.AddArgument(cadence.NewAddress(kittyItemsAddr))
	_ = tx.AddArgument(cadence.NewUInt64(typeID))

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kittyItemsAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kittyItemsSigner},
		false,
	)
}

func TransferItem(
	t *testing.T, b *emulator.Blockchain,
	nftAddress, kittyItemsAddr flow.Address, kittyItemsSigner crypto.Signer,
	typeID uint64, recipientAddr flow.Address, shouldFail bool,
) {

	tx := flow.NewTransaction().
		SetScript(TransferKittyItemScript(nftAddress.String(), kittyItemsAddr.String())).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kittyItemsAddr)

	_ = tx.AddArgument(cadence.NewAddress(recipientAddr))
	_ = tx.AddArgument(cadence.NewUInt64(typeID))

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kittyItemsAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kittyItemsSigner},
		shouldFail,
	)
}

func loadKittyItems(nftAddress string) []byte {
	return []byte(test.ReplaceImports(
		string(test.ReadFile(kittyItemsContractPath)),
		map[string]*regexp.Regexp{
			nftAddress: test.NonFungibleTokenAddressPlaceholder,
		},
	))
}

func replaceAddressPlaceholders(code, nftAddress, kittyItemsAddress string) []byte {
	return []byte(test.ReplaceImports(
		code,
		map[string]*regexp.Regexp{
			nftAddress:        test.NonFungibleTokenAddressPlaceholder,
			kittyItemsAddress: test.KittyItemsAddressPlaceHolder,
		},
	))
}

func SetupAccountScript(nftAddress, kittyItemsAddress string) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kittyItemsSetupAccountPath)),
		nftAddress,
		kittyItemsAddress,
	)
}

func MintKittyItemScript(nftAddress, kittyItemsAddress string) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kittyItemsMintKittyItemPath)),
		nftAddress,
		kittyItemsAddress,
	)
}

func TransferKittyItemScript(nftAddress, kittyItemsAddress string) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kittyItemsTransferKittyItemPath)),
		nftAddress,
		kittyItemsAddress,
	)
}

func GetKittyItemSupplyScript(nftAddress, kittyItemsAddress string) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kittyItemsGetKittyItemSupplyPath)),
		nftAddress,
		kittyItemsAddress,
	)
}

func GetCollectionLengthScript(nftAddress, kittyItemsAddress string) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kittyItemsGetCollectionLengthPath)),
		nftAddress,
		kittyItemsAddress,
	)
}
