package test

import (
	"regexp"
	"testing"

	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	"github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"

	ft_contracts "github.com/onflow/flow-ft/lib/go/contracts"
)

const (
	kibbleRootPath           = "../../.."
	kibbleContractPath       = kibbleRootPath + "/contracts/Kibble.cdc"
	kibbleSetupAccountPath   = kibbleRootPath + "/transactions/kibble/setup_account.cdc"
	kibbleTransferTokensPath = kibbleRootPath + "/transactions/kibble/transfer_tokens.cdc"
	kibbleMintTokensPath     = kibbleRootPath + "/transactions/kibble/mint_tokens.cdc"
	kibbleBurnTokensPath     = kibbleRootPath + "/transactions/kibble/burn_tokens.cdc"
	kibbleGetBalancePath     = kibbleRootPath + "/scripts/kibble/get_balance.cdc"
	kibbleGetSupplyPath      = kibbleRootPath + "/scripts/kibble/get_supply.cdc"
)

func KibbleDeployContracts(b *emulator.Blockchain, t *testing.T) (flow.Address, flow.Address, crypto.Signer) {
	accountKeys := test.AccountKeyGenerator()

	// Should be able to deploy a contract as a new account with no keys.
	fungibleTokenCode := loadFungibleToken()
	fungibleAddr, err := b.CreateAccount(
		[]*flow.AccountKey{},
		[]templates.Contract{templates.Contract{
			Name:   "FungibleToken",
			Source: string(fungibleTokenCode),
		}},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	kibbleAccountKey, kibbleSigner := accountKeys.NewWithSigner()
	kibbleCode := loadKibble(fungibleAddr)

	kibbleAddr, err := b.CreateAccount(
		[]*flow.AccountKey{kibbleAccountKey},
		[]templates.Contract{templates.Contract{
			Name:   "Kibble",
			Source: string(kibbleCode),
		}},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	// Simplify testing by having the contract address also be our initial Vault.
	KibbleSetupAccount(t, b, kibbleAddr, kibbleSigner, fungibleAddr, kibbleAddr)

	return fungibleAddr, kibbleAddr, kibbleSigner
}

func KibbleSetupAccount(t *testing.T, b *emulator.Blockchain, userAddress sdk.Address, userSigner crypto.Signer, fungibleAddr sdk.Address, kibbleAddr sdk.Address) {
	tx := flow.NewTransaction().
		SetScript(kibbleGenerateSetupKibbleAccountTransaction(fungibleAddr, kibbleAddr)).
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

func KibbleCreateAccount(t *testing.T, b *emulator.Blockchain, fungibleAddr sdk.Address, kibbleAddr sdk.Address) (sdk.Address, crypto.Signer) {
	userAddress, userSigner, _ := createAccount(t, b)
	KibbleSetupAccount(t, b, userAddress, userSigner, fungibleAddr, kibbleAddr)
	return userAddress, userSigner
}

func KibbleMint(t *testing.T, b *emulator.Blockchain, fungibleAddr sdk.Address, kibbleAddr sdk.Address, kibbleSigner crypto.Signer, recipientAddress flow.Address, amount string, shouldRevert bool) {
	tx := flow.NewTransaction().
		SetScript(kibbleGenerateMintKibbleTransaction(fungibleAddr, kibbleAddr)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kibbleAddr)

	_ = tx.AddArgument(cadence.NewAddress(recipientAddress))
	_ = tx.AddArgument(CadenceUFix64(amount))

	signAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kibbleAddr},
		[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
		shouldRevert,
	)

}

func TestKibbleDeployment(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, _ := KibbleDeployContracts(b, t)

	t.Run("Should have initialized Supply field correctly", func(t *testing.T) {
		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.EqualValues(t, CadenceUFix64("0.0"), supply)
	})
}

func TestKibbleSetupAccount(t *testing.T) {
	b := newEmulator()

	t.Run("Should be able to create empty vault that does not affect supply", func(t *testing.T) {
		fungibleAddr, kibbleAddr, _ := KibbleDeployContracts(b, t)

		userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

		userBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)
		assert.EqualValues(t, CadenceUFix64("0.0"), userBalance)

		supply := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr),
			nil,
		)
		assert.EqualValues(t, CadenceUFix64("0.0"), supply)
	})
}

func TestKibbleMinting(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)

	userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

	t.Run("Should not be able to mint zero tokens", func(t *testing.T) {
		KibbleMint(t, b, fungibleAddr, kibbleAddr, kibbleSigner, userAddress, "0.0", true)
	})

	t.Run("Should be able to mint tokens, deposit, update balance and total supply", func(t *testing.T) {
		KibbleMint(t, b, fungibleAddr, kibbleAddr, kibbleSigner, userAddress, "50.0", false)

		// Assert that vault balance is correct
		userBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)
		assert.EqualValues(t, CadenceUFix64("50.0"), userBalance)

		// Assert that total supply is correct
		supply := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr),
			nil,
		)
		assert.EqualValues(t, CadenceUFix64("50.0"), supply)
	})
}

func TestKibbleTransfers(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)

	userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

	KibbleMint(t, b, fungibleAddr, kibbleAddr, kibbleSigner, kibbleAddr, "1000.0", false)

	t.Run("Should not be able to withdraw more than the balance of the vault", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibbleGenerateTransferVaultScript(fungibleAddr, kibbleAddr)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		_ = tx.AddArgument(CadenceUFix64("30000.0"))
		_ = tx.AddArgument(cadence.NewAddress(userAddress))

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			true,
		)

		// Assert that vault balances are correct

		kibbleBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))},
		)
		assert.EqualValues(t, CadenceUFix64("1000.0"), kibbleBalance)

		userBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)
		assert.EqualValues(t, CadenceUFix64("0.0"), userBalance)
	})

	t.Run("Should be able to withdraw and deposit tokens from a vault", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibbleGenerateTransferVaultScript(fungibleAddr, kibbleAddr)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		_ = tx.AddArgument(CadenceUFix64("300.0"))
		_ = tx.AddArgument(cadence.NewAddress(userAddress))

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			false,
		)

		// Assert that vault balances are correct

		kibbleBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))},
		)
		assert.EqualValues(t, CadenceUFix64("700.0"), kibbleBalance)

		userBalance := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)
		assert.EqualValues(t, CadenceUFix64("300.0"), userBalance)

		supply := executeScriptAndCheck(
			t, b,
			kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr),
			nil,
		)
		assert.EqualValues(t, CadenceUFix64("1000.0"), supply)
	})
}

func kibbleReplaceAddressPlaceholders(code string, fungibleAddress, kibbleAddress string) []byte {
	return []byte(replaceImports(
		code,
		map[string]*regexp.Regexp{
			fungibleAddress: ftAddressPlaceholder,
			kibbleAddress:   kibbleAddressPlaceHolder,
		},
	))
}

func loadFungibleToken() []byte {
	return ft_contracts.FungibleToken()
}

func loadKibble(fungibleAddr flow.Address) []byte {
	return []byte(replaceImports(
		string(readFile(kibbleContractPath)),
		map[string]*regexp.Regexp{
			fungibleAddr.String(): ftAddressPlaceholder,
		},
	))
}

func kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr flow.Address) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleGetSupplyPath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}

func kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr flow.Address) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleGetBalancePath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}
func kibbleGenerateTransferVaultScript(fungibleAddr, kibbleAddr flow.Address) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleTransferTokensPath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}

func kibbleGenerateSetupKibbleAccountTransaction(fungibleAddr, kibbleAddr flow.Address) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleSetupAccountPath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}

func kibbleGenerateMintKibbleTransaction(fungibleAddr, kibbleAddr flow.Address) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleMintTokensPath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}
