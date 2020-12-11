package test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	emulator "github.com/onflow/flow-emulator"
	"github.com/onflow/flow-go-sdk"
	sdk "github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	"github.com/onflow/flow-go-sdk/templates"
	"github.com/onflow/flow-go-sdk/test"

	ft_contracts "github.com/onflow/flow-ft/lib/go/contracts"
)

const (
	kibbleRootPath           = "../../../cadence/kibble"
	kibbleKibblePath         = kibbleRootPath + "/contracts/Kibble.cdc"
	kibbleSetupAccountPath   = kibbleRootPath + "/transactions/setup_account.cdc"
	kibbleTransferTokensPath = kibbleRootPath + "/transactions/transfer_tokens.cdc"
	kibbleMintTokensPath     = kibbleRootPath + "/transactions/mint_tokens.cdc"
	kibbleBurnTokensPath     = kibbleRootPath + "/transactions/burn_tokens.cdc"
	kibbleGetBalancePath     = kibbleRootPath + "/scripts/get_balance.cdc"
	kibbleGetSupplyPath      = kibbleRootPath + "/scripts/get_supply.cdc"
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

	tokenAddr, err := b.CreateAccount(
		[]*flow.AccountKey{kibbleAccountKey},
		[]templates.Contract{templates.Contract{
			Name:   "Kibble",
			Source: string(kibbleCode),
		}},
	)
	assert.NoError(t, err)

	_, err = b.CommitBlock()
	assert.NoError(t, err)

	return fungibleAddr, tokenAddr, kibbleSigner
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

func KibbleMint(t *testing.T, b *emulator.Blockchain, fungibleAddr sdk.Address, kibbleAddr sdk.Address, kibbleSigner crypto.Signer, recipientAddress flow.Address, amount string) {
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
		false,
	)

}

func TestKibbleDeployment(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, _ := KibbleDeployContracts(b, t)

	t.Run("Should have initialized Supply field correctly", func(t *testing.T) {
		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		expectedSupply, expectedSupplyErr := cadence.NewUFix64("1000.0")
		assert.NoError(t, expectedSupplyErr)
		assert.Equal(t, supply.(cadence.UFix64), expectedSupply)
	})
}

func TestKibbleSetupAccount(t *testing.T) {
	b := newEmulator()

	t.Run("Should be able to create empty Vault that doesn't affect supply", func(t *testing.T) {

		fungibleAddr, kibbleAddr, _ := KibbleDeployContracts(b, t)

		userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

		balance := executeScriptAndCheck(t, b, kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		assert.Equal(t, CadenceUFix64("0.0"), balance)

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, CadenceUFix64("1000.0"), supply.(cadence.UFix64))
	})
}

func TestKibbleExternalTransfers(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)

	userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

	t.Run("Shouldn't be able to withdraw more than the balance of the Vault", func(t *testing.T) {
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

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("1000.0"))

		result, err = b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance = result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("0.0"))
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

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("700.0"))

		result, err = b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance = result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("300.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("1000.0"))
	})
}

func TestKibbleVaultDestroy(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)

	userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

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

	/*t.Run("Should subtract tokens from supply when they are destroyed", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(generateDestroyVaultScript(fungibleAddr, kibbleAddr, 100)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			false,
		)

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("600.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("900.0"))
	})

	t.Run("Should subtract tokens from supply when they are destroyed by a different account", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(generateDestroyVaultScript(fungibleAddr, kibbleAddr, 100)).
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

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("200.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("800.0"))
	})
	*/
}

func TestKibbleMintingAndBurning(t *testing.T) {
	b := newEmulator()

	fungibleAddr, kibbleAddr, kibbleSigner := KibbleDeployContracts(b, t)

	userAddress, _ := KibbleCreateAccount(t, b, fungibleAddr, kibbleAddr)

	t.Run("Shouldn't be able to mint zero tokens", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibbleGenerateMintKibbleTransaction(fungibleAddr, kibbleAddr)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		_ = tx.AddArgument(cadence.NewAddress(userAddress))
		_ = tx.AddArgument(CadenceUFix64("0.0"))

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			true,
		)

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("1000.0"))

		// Assert that the vaults' balances are correct
		result, err = b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance = result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("0.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("1000.0"))
	})

	t.Run("Should mint tokens, deposit, and update balance and total supply", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibbleGenerateMintKibbleTransaction(fungibleAddr, kibbleAddr)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		_ = tx.AddArgument(cadence.NewAddress(userAddress))
		_ = tx.AddArgument(CadenceUFix64("50.0"))

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			false,
		)

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("1000.0"))

		// Assert that the vaults' balances are correct
		result, err = b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance = result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("50.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("1050.0"))
	})

	/*t.Run("Should burn tokens and update balance and total supply", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(generateBurnTokensScript(fungibleAddr, kibbleAddr)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddr)

		_ = tx.AddArgument(CadenceUFix64("50.0"))

		signAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddr},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			false,
		)

		// Assert that the vaults' balances are correct
		result, err := b.ExecuteScript(kibbleGenerateGetBalanceScript(fungibleAddr, kibbleAddr), [][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddr))})
		require.NoError(t, err)
		if !assert.True(t, result.Succeeded()) {
			t.Log(result.Error.Error())
		}
		balance := result.Value
		assert.Equal(t, balance.(cadence.UFix64), CadenceUFix64("950.0"))

		supply := executeScriptAndCheck(t, b, kibbleGenerateGetSupplyScript(fungibleAddr, kibbleAddr), nil)
		assert.Equal(t, supply.(cadence.UFix64), CadenceUFix64("1000.0"))
	})*/
}

func kibbleReplaceAddressPlaceholders(code string, fungibleAddress, kibbleAddress string) []byte {
	return []byte(replaceStrings(
		code,
		map[string]string{
			ftAddressPlaceholder:     "0x" + fungibleAddress,
			kibbleAddressPlaceHolder: "0x" + kibbleAddress,
		},
	))
}

func loadFungibleToken() []byte {
	return ft_contracts.FungibleToken()
}

func loadKibble(fungibleAddr flow.Address) []byte {
	return []byte(strings.ReplaceAll(
		string(readFile(kibbleKibblePath)),
		ftAddressPlaceholder,
		"0x"+fungibleAddr.String(),
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

/*func kibbleGenerateDestroyVaultScript(fungibleAddr, kibbleAddr flow.Address, amount cadence.UFix64) []byte {
	return kibbleReplaceAddressPlaceholders(
		string(readFile(kibbleKibblePath)),
		fungibleAddr.String(),
		kibbleAddr.String(),
	)
}*/
