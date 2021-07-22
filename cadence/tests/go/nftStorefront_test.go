package test

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/onflow/cadence"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"
)

const (
	nftStorefrontContractPath = "../../../contracts/NFTStorefront.cdc"

	nftStorefrontTransactionRootPath = "../../../transactions/nftStorefront"
	nftStorefrontSetupAccountPath    = nftStorefrontTransactionRootPath + "/setup_account.cdc"
	nftStorefrontSellItemPath        = nftStorefrontTransactionRootPath + "/sell_item.cdc"
	nftStorefrontBuyItemPath         = nftStorefrontTransactionRootPath + "/buy_item.cdc"
	nftStorefrontRemoveItemPath      = nftStorefrontTransactionRootPath + "/remove_item.cdc"
)

const typeID1337 = 1337

type TestContractsInfo struct {
	FungibleTokenAddress    flow.Address
	KibbleAddress           flow.Address
	KibbleSigner            crypto.Signer
	NonFungibleTokenAddress flow.Address
	KittyItemsAddress       flow.Address
	KittyItemsSigner        crypto.Signer
	NFTStorefrontAddress    flow.Address
	NFTStorefrontSigner     crypto.Signer
}

func NFTStorefrontDeployContracts(b *emulator.Blockchain, t *testing.T) TestContractsInfo {
	accountKeys := test.AccountKeyGenerator()

	fungibleTokenAddress, kibbleAddress, kibbleSigner := KibbleDeployContracts(b, t)
	nonFungibleTokenAddress, kittyItemsAddress, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	// Should be able to deploy a contract as a new account with one key.
	nftStorefrontAccountKey, nftStorefrontSigner := accountKeys.NewWithSigner()
	nftStorefrontCode := loadNFTStorefront(
		fungibleTokenAddress,
		nonFungibleTokenAddress,
		kibbleAddress,
		kittyItemsAddress,
	)

	nftStorefrontAddr, err := b.CreateAccount(
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

	// simplify the workflow by having contract addresses also be our initial test collections
	KittyItemsSetupAccount(t, b, kittyItemsAddress, kittyItemsSigner, nonFungibleTokenAddress, kittyItemsAddress)
	NFTStorefrontSetupAccount(b, t, nftStorefrontAddr, nftStorefrontSigner, nftStorefrontAddr)

	return TestContractsInfo{
		fungibleTokenAddress,
		kibbleAddress,
		kibbleSigner,
		nonFungibleTokenAddress,
		kittyItemsAddress,
		kittyItemsSigner,
		nftStorefrontAddr,
		nftStorefrontSigner,
	}
}

func NFTStorefrontSetupAccount(
	b *emulator.Blockchain,
	t *testing.T,
	userAddress sdk.Address,
	userSigner crypto.Signer,
	nftStorefrontAddr sdk.Address,
) {
	tx := flow.NewTransaction().
		SetScript(nftStorefrontGenerateSetupAccountScript(nftStorefrontAddr.String())).
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

// Create a new account with the Kibble and KittyItems resources set up BUT no NFTStorefront resource.
func NFTStorefrontCreatePurchaserAccount(
	b *emulator.Blockchain,
	t *testing.T,
	contracts TestContractsInfo,
) (sdk.Address, crypto.Signer) {
	userAddress, userSigner, _ := createAccount(t, b)
	KibbleSetupAccount(t, b, userAddress, userSigner, contracts.FungibleTokenAddress, contracts.KibbleAddress)
	KittyItemsSetupAccount(t, b, userAddress, userSigner, contracts.NonFungibleTokenAddress, contracts.KittyItemsAddress)
	return userAddress, userSigner
}

// Create a new account with the Kibble, KittyItems, and NFTStorefront resources set up.
func NFTStorefrontCreateAccount(
	b *emulator.Blockchain,
	t *testing.T,
	contracts TestContractsInfo,
) (sdk.Address, crypto.Signer) {
	userAddress, userSigner := NFTStorefrontCreatePurchaserAccount(b, t, contracts)
	NFTStorefrontSetupAccount(b, t, userAddress, userSigner, contracts.NFTStorefrontAddress)
	return userAddress, userSigner
}

func NFTStorefrontListItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address,
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
	_ = tx.AddArgument(CadenceUFix64(price))

	result := signAndSubmit(
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

func NFTStorefrontPurchaseItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address,
	userSigner crypto.Signer,
	storefrontAddress sdk.Address,
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

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func NFTStorefrontRemoveItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address,
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

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func TestNFTStorefrontDeployContracts(t *testing.T) {
	b := newEmulator()
	NFTStorefrontDeployContracts(b, t)
}

func TestNFTStorefrontSetupAccount(t *testing.T) {
	b := newEmulator()

	contracts := NFTStorefrontDeployContracts(b, t)

	t.Run("Should be able to create an empty Collection", func(t *testing.T) {
		userAddress, userSigner, _ := createAccount(t, b)
		NFTStorefrontSetupAccount(b, t, userAddress, userSigner, contracts.NFTStorefrontAddress)
	})
}

func TestNFTStorefrontCreateSaleOffer(t *testing.T) {
	b := newEmulator()

	contracts := NFTStorefrontDeployContracts(b, t)

	t.Run("Should be able to create a sale offer and list it", func(t *testing.T) {
		tokenToList := uint64(0)
		tokenPrice := "1.11"
		userAddress, userSigner := NFTStorefrontCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		NFTStorefrontListItem(
			t,
			b,
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
		userAddress, userSigner := NFTStorefrontCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		saleOfferResourceID := NFTStorefrontListItem(
			t,
			b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)

		buyerAddress, buyerSigner := NFTStorefrontCreatePurchaserAccount(b, t, contracts)

		// fund the purchase
		KibbleMint(
			t,
			b,
			contracts.FungibleTokenAddress,
			contracts.KibbleAddress,
			contracts.KibbleSigner,
			buyerAddress,
			"100.0",
			false,
		)

		// Make the purchase
		NFTStorefrontPurchaseItem(
			t,
			b,
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
		userAddress, userSigner := NFTStorefrontCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NonFungibleTokenAddress,
			contracts.KittyItemsAddress,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		saleOfferResourceID := NFTStorefrontListItem(
			t,
			b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)

		// make the purchase
		NFTStorefrontRemoveItem(
			t,
			b,
			contracts,
			userAddress,
			userSigner,
			saleOfferResourceID,
			false,
		)
	})
}

func replaceNFTStorefrontAddressPlaceholders(codeBytes []byte, contracts TestContractsInfo) []byte {
	return []byte(replaceImports(
		string(codeBytes),
		map[string]*regexp.Regexp{
			contracts.FungibleTokenAddress.String():    fungibleTokenAddressPlaceholder,
			contracts.KibbleAddress.String():           kibbleAddressPlaceHolder,
			contracts.NonFungibleTokenAddress.String(): nonFungibleTokenAddressPlaceholder,
			contracts.KittyItemsAddress.String():       kittyItemsAddressPlaceHolder,
			contracts.NFTStorefrontAddress.String():    nftStorefrontPlaceholder,
		},
	))
}

func loadNFTStorefront(fungibleTokenAddress, nonFungibleTokenAddress, kibbleAddress, kittyItemsAddress flow.Address) []byte {
	return replaceNFTStorefrontAddressPlaceholders(
		readFile(nftStorefrontContractPath),
		TestContractsInfo{
			FungibleTokenAddress:    fungibleTokenAddress,
			KibbleAddress:           kibbleAddress,
			NonFungibleTokenAddress: nonFungibleTokenAddress,
			KittyItemsAddress:       kittyItemsAddress,
		},
	)
}

func nftStorefrontGenerateSetupAccountScript(nftStorefrontAddr string) []byte {
	return []byte(replaceImports(
		string(readFile(nftStorefrontSetupAccountPath)),
		map[string]*regexp.Regexp{
			nftStorefrontAddr: nftStorefrontPlaceholder,
		},
	))
}

func nftStorefrontGenerateSellItemScript(contracts TestContractsInfo) []byte {
	return replaceNFTStorefrontAddressPlaceholders(
		readFile(nftStorefrontSellItemPath),
		contracts,
	)
}

func nftStorefrontGenerateBuyItemScript(contracts TestContractsInfo) []byte {
	return replaceNFTStorefrontAddressPlaceholders(
		readFile(nftStorefrontBuyItemPath),
		contracts,
	)
}

func nftStorefrontGenerateRemoveItemScript(contracts TestContractsInfo) []byte {
	return replaceNFTStorefrontAddressPlaceholders(
		readFile(nftStorefrontRemoveItemPath),
		contracts,
	)
}
