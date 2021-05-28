package test

import (
	"github.com/onflow/cadence"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	sdktemplates "github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"
	"regexp"
	"testing"
)

const (
	kittyItemsMarketTransactionRootPath = "../../../transactions/kittyItemsMarket"

	kittyItemsMarketContractPath     = "../../../contracts/KittyItemsMarket.cdc"
	kittyItemsMarketSetupAccountPath = kittyItemsMarketTransactionRootPath + "/setup_account.cdc"
	kittyItemsMarketSellItemPath     = kittyItemsMarketTransactionRootPath + "/sell_market_item.cdc"
	kittyItemsMarketBuyItemPath      = kittyItemsMarketTransactionRootPath + "/buy_market_item.cdc"
	kittyItemsMarketRemoveItemPath   = kittyItemsMarketTransactionRootPath + "/remove_market_item.cdc"
)

const typeID1337 = 1337

type TestContractsInfo struct {
	FTAddr                 flow.Address
	KibbleAddr             flow.Address
	KibbleSigner           crypto.Signer
	NFTAddr                flow.Address
	KittyItemsAddr         flow.Address
	KittyItemsSigner       crypto.Signer
	KittyItemsMarketAddr   flow.Address
	KittyItemsMarketSigner crypto.Signer
}

func KittyItemsMarketDeployContracts(b *emulator.Blockchain, t *testing.T) TestContractsInfo {
	accountKeys := test.AccountKeyGenerator()

	ftAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)
	nftAddr, kittyItemsAddr, kittyItemsSigner := KittyItemsDeployContracts(b, t)

	// Should be able to deploy a contract as a new account with one key.
	kittyItemsMarketAccountKey, kittyItemsMarketSigner := accountKeys.NewWithSigner()
	kittyItemsMarketCode := loadKittyItemsMarket(
		ftAddr,
		nftAddr,
		kibbleAddr,
		kittyItemsAddr,
	)

	kittyItemsMarketAddr, err := b.CreateAccount(
		[]*flow.AccountKey{kittyItemsMarketAccountKey},
		[]sdktemplates.Contract{
			{
				Name:   "KittyItemsMarket",
				Source: string(kittyItemsMarketCode),
			},
		},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// simplify the workflow by having contract addresses also be our initial test collections
	KittyItemsSetupAccount(t, b, kittyItemsAddr, kittyItemsSigner, nftAddr, kittyItemsAddr)
	KittyItemsMarketSetupAccount(b, t, kittyItemsMarketAddr, kittyItemsMarketSigner, kittyItemsMarketAddr)

	return TestContractsInfo{
		ftAddr,
		kibbleAddr,
		kibbleSigner,
		nftAddr,
		kittyItemsAddr,
		kittyItemsSigner,
		kittyItemsMarketAddr,
		kittyItemsMarketSigner,
	}
}

func KittyItemsMarketSetupAccount(
	b *emulator.Blockchain,
	t *testing.T,
	userAddress sdk.Address,
	userSigner crypto.Signer,
	kittyItemsMarketAddr sdk.Address,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsMarketGenerateSetupAccountScript(kittyItemsMarketAddr.String())).
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

// Create a new account with the Kibble and KittyItems resources set up BUT no KittyItemsMarket resource.
func KittyItemsMarketCreatePurchaserAccount(
	b *emulator.Blockchain,
	t *testing.T,
	contracts TestContractsInfo,
) (sdk.Address, crypto.Signer) {
	userAddress, userSigner, _ := createAccount(t, b)
	KibbleSetupAccount(t, b, userAddress, userSigner, contracts.FTAddr, contracts.KibbleAddr)
	KittyItemsSetupAccount(t, b, userAddress, userSigner, contracts.NFTAddr, contracts.KittyItemsAddr)
	return userAddress, userSigner
}

// Create a new account with the Kibble, KittyItems, and KittyItemsMarket resources set up.
func KittyItemsMarketCreateAccount(
	b *emulator.Blockchain,
	t *testing.T,
	contracts TestContractsInfo,
) (sdk.Address, crypto.Signer) {
	userAddress, userSigner := KittyItemsMarketCreatePurchaserAccount(b, t, contracts)
	KittyItemsMarketSetupAccount(b, t, userAddress, userSigner, contracts.KittyItemsMarketAddr)
	return userAddress, userSigner
}

func KittyItemsMarketListItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address, userSigner crypto.Signer, tokenID uint64,
	price string, shouldFail bool,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsMarketGenerateSellItemScript(contracts)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	_ = tx.AddArgument(cadence.NewUInt64(tokenID))
	_ = tx.AddArgument(CadenceUFix64(price))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func KittyItemsMarketPurchaseItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address,
	userSigner crypto.Signer,
	marketCollectionAddress sdk.Address,
	tokenID uint64,
	shouldFail bool,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsMarketGenerateBuyItemScript(contracts)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(userAddress)

	_ = tx.AddArgument(cadence.NewUInt64(tokenID))
	_ = tx.AddArgument(cadence.NewAddress(marketCollectionAddress))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, userAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), userSigner},
		shouldFail,
	)
}

func KittyItemsMarketRemoveItem(
	t *testing.T,
	b *emulator.Blockchain,
	contracts TestContractsInfo,
	userAddress sdk.Address,
	userSigner crypto.Signer,
	tokenID uint64,
	shouldFail bool,
) {
	tx := flow.NewTransaction().
		SetScript(kittyItemsMarketGenerateRemoveItemScript(contracts)).
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

func TestKittyItemsMarketDeployContracts(t *testing.T) {
	b := newEmulator()
	KittyItemsMarketDeployContracts(b, t)
}

func TestKittyItemsMarketSetupAccount(t *testing.T) {
	b := newEmulator()

	contracts := KittyItemsMarketDeployContracts(b, t)

	t.Run("Should be able to create an empty Collection", func(t *testing.T) {
		userAddress, userSigner, _ := createAccount(t, b)
		KittyItemsMarketSetupAccount(b, t, userAddress, userSigner, contracts.KittyItemsMarketAddr)
	})
}

func TestKittyItemsMarketCreateSaleOffer(t *testing.T) {
	b := newEmulator()

	contracts := KittyItemsMarketDeployContracts(b, t)

	t.Run("Should be able to create a sale offer and list it", func(t *testing.T) {
		tokenToList := uint64(0)
		tokenPrice := "1.11"
		userAddress, userSigner := KittyItemsMarketCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		KittyItemsMarketListItem(
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
		userAddress, userSigner := KittyItemsMarketCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		KittyItemsMarketListItem(
			t,
			b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			tokenPrice,
			false,
		)

		buyerAddress, buyerSigner := KittyItemsMarketCreatePurchaserAccount(b, t, contracts)

		// fund the purchase
		KibbleMint(
			t,
			b,
			contracts.FTAddr,
			contracts.KibbleAddr,
			contracts.KibbleSigner,
			buyerAddress,
			"100.0",
			false,
		)
		// Make the purchase
		KittyItemsMarketPurchaseItem(
			t,
			b,
			contracts,
			buyerAddress,
			buyerSigner,
			userAddress,
			tokenToList,
			false,
		)
	})

	t.Run("Should be able to remove a sale offer", func(t *testing.T) {
		tokenToList := uint64(2)
		tokenPrice := "1.11"
		userAddress, userSigner := KittyItemsMarketCreateAccount(b, t, contracts)

		// contract mints item
		KittyItemsMintItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			typeID1337,
		)

		// contract transfers item to another seller account (we don't need to do this)
		KittyItemsTransferItem(
			t,
			b,
			contracts.NFTAddr,
			contracts.KittyItemsAddr,
			contracts.KittyItemsSigner,
			tokenToList,
			userAddress,
			false,
		)

		// other seller account lists the item
		KittyItemsMarketListItem(
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
		KittyItemsMarketRemoveItem(
			t,
			b,
			contracts,
			userAddress,
			userSigner,
			tokenToList,
			false,
		)
	})
}

func replaceKittyItemsMarketAddressPlaceholders(codeBytes []byte, contracts TestContractsInfo) []byte {
	return []byte(replaceImports(
		string(codeBytes),
		map[string]*regexp.Regexp{
			contracts.FTAddr.String():               ftAddressPlaceholder,
			contracts.KibbleAddr.String():           kibbleAddressPlaceHolder,
			contracts.NFTAddr.String():              nftAddressPlaceholder,
			contracts.KittyItemsAddr.String():       kittyItemsAddressPlaceHolder,
			contracts.KittyItemsMarketAddr.String(): kittyItemsMarketPlaceholder,
		},
	))
}

func loadKittyItemsMarket(ftAddr, nftAddr, kibbleAddr, kittyItemsAddr flow.Address) []byte {
	return replaceKittyItemsMarketAddressPlaceholders(
		readFile(kittyItemsMarketContractPath),
		TestContractsInfo{
			FTAddr:         ftAddr,
			KibbleAddr:     kibbleAddr,
			NFTAddr:        nftAddr,
			KittyItemsAddr: kittyItemsAddr,
		},
	)
}

func kittyItemsMarketGenerateSetupAccountScript(kittyItemsMarketAddr string) []byte {
	return []byte(replaceImports(
		string(readFile(kittyItemsMarketSetupAccountPath)),
		map[string]*regexp.Regexp{
			kittyItemsMarketAddr: kittyItemsMarketPlaceholder,
		},
	))
}

func kittyItemsMarketGenerateSellItemScript(contracts TestContractsInfo) []byte {
	return replaceKittyItemsMarketAddressPlaceholders(
		readFile(kittyItemsMarketSellItemPath),
		contracts,
	)
}

func kittyItemsMarketGenerateBuyItemScript(contracts TestContractsInfo) []byte {
	return replaceKittyItemsMarketAddressPlaceholders(
		readFile(kittyItemsMarketBuyItemPath),
		contracts,
	)
}

func kittyItemsMarketGenerateRemoveItemScript(contracts TestContractsInfo) []byte {
	return replaceKittyItemsMarketAddressPlaceholders(
		readFile(kittyItemsMarketRemoveItemPath),
		contracts,
	)
}
