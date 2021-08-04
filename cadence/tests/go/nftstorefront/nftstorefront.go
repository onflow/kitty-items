package nftstorefront

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/onflow/cadence"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	sdktest "github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"

	"github.com/onflow/kitty-items/cadence/test/go/kibble"
	"github.com/onflow/kitty-items/cadence/test/go/kittyitems"
	"github.com/onflow/kitty-items/cadence/test/go/test"
)

const (
	nftStorefrontContractPath = "../../contracts/NFTStorefront.cdc"

	nftStorefrontTransactionRootPath = "../../transactions/nftStorefront"
	nftStorefrontSetupAccountPath    = nftStorefrontTransactionRootPath + "/setup_account.cdc"
	nftStorefrontSellItemPath        = nftStorefrontTransactionRootPath + "/sell_item_kibble.cdc"
	nftStorefrontBuyItemPath         = nftStorefrontTransactionRootPath + "/buy_item_kibble.cdc"
	nftStorefrontRemoveItemPath      = nftStorefrontTransactionRootPath + "/remove_item.cdc"
)

func DeployContracts(t *testing.T, b *emulator.Blockchain) test.Contracts {
	accountKeys := sdktest.AccountKeyGenerator()

	fungibleTokenAddress, kibbleAddress, kibbleSigner := kibble.DeployContracts(t, b)
	nonFungibleTokenAddress, kittyItemsAddress, kittyItemsSigner := kittyitems.DeployContracts(t, b)

	// Should be able to deploy a contract as a new account with one key.
	nftStorefrontAccountKey, nftStorefrontSigner := accountKeys.NewWithSigner()
	nftStorefrontCode := loadNFTStorefront(
		fungibleTokenAddress,
		nonFungibleTokenAddress,
		kibbleAddress,
		kittyItemsAddress,
	)

	nftStorefrontAddress, err := b.CreateAccount(
		[]*flow.AccountKey{nftStorefrontAccountKey},
		[]sdktemplates.Contract{
			{
				Name:   "NFTStorefront",
				Source: string(nftStorefrontCode),
			},
		},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// simplify the workflow by having contract addresses also be our initial test storefronts
	kittyitems.SetupAccount(t, b, kittyItemsAddress, kittyItemsSigner, nonFungibleTokenAddress, kittyItemsAddress)
	SetupAccount(t, b, nftStorefrontAddress, nftStorefrontSigner, nftStorefrontAddress)

	return test.Contracts{
		FungibleTokenAddress:    fungibleTokenAddress,
		KibbleAddress:           kibbleAddress,
		KibbleSigner:            kibbleSigner,
		NonFungibleTokenAddress: nonFungibleTokenAddress,
		KittyItemsAddress:       kittyItemsAddress,
		KittyItemsSigner:        kittyItemsSigner,
		NFTStorefrontAddress:    nftStorefrontAddress,
		NFTStorefrontSigner:     nftStorefrontSigner,
	}
}

func SetupAccount(
	t *testing.T,
	b *emulator.Blockchain,
	userAddress flow.Address,
	userSigner crypto.Signer,
	nftStorefrontAddr flow.Address,
) {
	tx := flow.NewTransaction().
		SetScript(nftStorefrontGenerateSetupAccountScript(nftStorefrontAddr.String())).
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

// Create a new account with the Kibble and KittyItems resources set up BUT no NFTStorefront resource.
func CreatePurchaserAccount(
	t *testing.T,
	b *emulator.Blockchain,
	contracts test.Contracts,
) (flow.Address, crypto.Signer) {
	userAddress, userSigner, _ := test.CreateAccount(t, b)
	kibble.SetupAccount(t, b, userAddress, userSigner, contracts.FungibleTokenAddress, contracts.KibbleAddress)
	kittyitems.SetupAccount(t, b, userAddress, userSigner, contracts.NonFungibleTokenAddress, contracts.KittyItemsAddress)
	return userAddress, userSigner
}

func CreateAccount(
	t *testing.T,
	b *emulator.Blockchain,
	contracts test.Contracts,
) (flow.Address, crypto.Signer) {
	userAddress, userSigner := CreatePurchaserAccount(t, b, contracts)
	SetupAccount(t, b, userAddress, userSigner, contracts.NFTStorefrontAddress)
	return userAddress, userSigner
}

func ListItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts test.Contracts,
	userAddress flow.Address,
	userSigner crypto.Signer,
	tokenID uint64,
	price string,
	shouldFail bool,
) (saleOfferResourceID uint64) {
	tx := flow.NewTransaction().
		SetScript(nftStorefrontGenerateSellItemScript(contracts)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	_ = tx.AddArgument(cadence.NewUInt64(tokenID))
	_ = tx.AddArgument(test.CadenceUFix64(price))

	result := test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)

	saleOfferAvailableEventType := fmt.Sprintf(
		"A.%s.NFTStorefront.SaleOfferAvailable",
		contracts.NFTStorefrontAddress,
	)

	for _, event := range result.Events {
		if event.Type == saleOfferAvailableEventType {
			return event.Value.Fields[1].ToGoValue().(uint64)
		}
	}

	return 0
}

func PurchaseItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts test.Contracts,
	userAddress flow.Address,
	userSigner crypto.Signer,
	storefrontAddress flow.Address,
	tokenID uint64,
	shouldFail bool,
) {
	tx := flow.NewTransaction().
		SetScript(nftStorefrontGenerateBuyItemScript(contracts)).
		SetGasLimit(200).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	_ = tx.AddArgument(cadence.NewUInt64(tokenID))
	_ = tx.AddArgument(cadence.NewAddress(storefrontAddress))

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func RemoveItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts test.Contracts,
	userAddress flow.Address,
	userSigner crypto.Signer,
	tokenID uint64,
	shouldFail bool,
) {
	tx := flow.NewTransaction().
		SetScript(nftStorefrontGenerateRemoveItemScript(contracts)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	_ = tx.AddArgument(cadence.NewUInt64(tokenID))

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func replaceAddressPlaceholders(codeBytes []byte, contracts test.Contracts) []byte {
	return []byte(test.ReplaceImports(
		string(codeBytes),
		map[string]*regexp.Regexp{
			contracts.FungibleTokenAddress.String():    test.FungibleTokenAddressPlaceholder,
			contracts.KibbleAddress.String():           test.KibbleAddressPlaceHolder,
			contracts.NonFungibleTokenAddress.String(): test.NonFungibleTokenAddressPlaceholder,
			contracts.KittyItemsAddress.String():       test.KittyItemsAddressPlaceHolder,
			contracts.NFTStorefrontAddress.String():    test.NFTStorefrontPlaceholder,
		},
	))
}

func loadNFTStorefront(
	fungibleTokenAddress,
	nonFungibleTokenAddress,
	kibbleAddress,
	kittyItemsAddress flow.Address,
) []byte {
	return replaceAddressPlaceholders(
		test.ReadFile(nftStorefrontContractPath),
		test.Contracts{
			FungibleTokenAddress:    fungibleTokenAddress,
			KibbleAddress:           kibbleAddress,
			NonFungibleTokenAddress: nonFungibleTokenAddress,
			KittyItemsAddress:       kittyItemsAddress,
		},
	)
}

func nftStorefrontGenerateSetupAccountScript(nftStorefrontAddr string) []byte {
	return []byte(test.ReplaceImports(
		string(test.ReadFile(nftStorefrontSetupAccountPath)),
		map[string]*regexp.Regexp{
			nftStorefrontAddr: test.NFTStorefrontPlaceholder,
		},
	))
}

func nftStorefrontGenerateSellItemScript(contracts test.Contracts) []byte {
	return replaceAddressPlaceholders(
		test.ReadFile(nftStorefrontSellItemPath),
		contracts,
	)
}

func nftStorefrontGenerateBuyItemScript(contracts test.Contracts) []byte {
	return replaceAddressPlaceholders(
		test.ReadFile(nftStorefrontBuyItemPath),
		contracts,
	)
}

func nftStorefrontGenerateRemoveItemScript(contracts test.Contracts) []byte {
	return replaceAddressPlaceholders(
		test.ReadFile(nftStorefrontRemoveItemPath),
		contracts,
	)
}
