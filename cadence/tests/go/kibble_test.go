package test

import (
	"testing"
	"github.com/onflow/cadence"
	jsoncdc "github.com/onflow/cadence/encoding/json"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	"github.com/stretchr/testify/assert"

	"github.com/onflow/kitty-items/cadence/test/go/kibble"
	"github.com/onflow/kitty-items/cadence/test/go/test"
)

func TestKibbleDeployment(t *testing.T) {
	b := test.NewBlockchain()

	fungibleTokenAddress, kibbleAddress, _ := kibble.DeployContracts(t, b)

	t.Run("Should have initialized Supply field correctly", func(t *testing.T) {
		supply := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetSupplyScript(fungibleTokenAddress, kibbleAddress),
			nil,
		)
		assert.EqualValues(t, test.CadenceUFix64("0.0"), supply)
	})
}

func TestKibbleSetupAccount(t *testing.T) {
	b := test.NewBlockchain()

	t.Run("Should be able to create empty vault that does not affect supply", func(t *testing.T) {
		fungibleAddr, kibbleAddr, _ := kibble.DeployContracts(t, b)

		userAddress, _ := kibble.CreateAccount(t, b, fungibleAddr, kibbleAddr)

		userBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleAddr, kibbleAddr),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)
		assert.EqualValues(t, test.CadenceUFix64("0.0"), userBalance)

		supply := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetSupplyScript(fungibleAddr, kibbleAddr),
			nil,
		)
		assert.EqualValues(t, test.CadenceUFix64("0.0"), supply)
	})
}

func TestKibbleMinting(t *testing.T) {
	b := test.NewBlockchain()

	fungibleTokenAddress, kibbleAddress, kibbleSigner := kibble.DeployContracts(t, b)

	userAddress, _ := kibble.CreateAccount(t, b, fungibleTokenAddress, kibbleAddress)

	t.Run("Should not be able to mint zero tokens", func(t *testing.T) {
		kibble.Mint(
			t, b,
			fungibleTokenAddress,
			kibbleAddress,
			kibbleSigner,
			userAddress,
			"0.0",
			true,
		)
	})

	t.Run("Should be able to mint tokens, deposit, update balance and total supply", func(t *testing.T) {

		kibble.Mint(
			t, b,
			fungibleTokenAddress,
			kibbleAddress,
			kibbleSigner,
			userAddress,
			"50.0",
			false,
		)

		// Assert that vault balance is correct
		userBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleTokenAddress, kibbleAddress),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)

		assert.EqualValues(t, test.CadenceUFix64("50.0"), userBalance)

		// Assert that total supply is correct
		supply := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetSupplyScript(fungibleTokenAddress, kibbleAddress),
			nil,
		)

		assert.EqualValues(t, test.CadenceUFix64("50.0"), supply)
	})
}

func TestKibbleTransfers(t *testing.T) {
	b := test.NewBlockchain()

	fungibleTokenAddress, kibbleAddress, kibbleSigner := kibble.DeployContracts(t, b)

	userAddress, _ := kibble.CreateAccount(t, b, fungibleTokenAddress, kibbleAddress)

	// Mint 1000 new Kibble into the Kibble contract account
	kibble.Mint(
		t, b,
		fungibleTokenAddress,
		kibbleAddress,
		kibbleSigner,
		kibbleAddress,
		"1000.0",
		false,
	)

	t.Run("Should not be able to withdraw more than the balance of the vault", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibble.TransferVaultScript(fungibleTokenAddress, kibbleAddress)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddress)

		_ = tx.AddArgument(test.CadenceUFix64("30000.0"))
		_ = tx.AddArgument(cadence.NewAddress(userAddress))

		test.SignAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddress},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			true,
		)

		// Assert that vault balances are correct

		kibbleBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleTokenAddress, kibbleAddress),
			[][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddress))},
		)

		assert.EqualValues(t, test.CadenceUFix64("1000.0"), kibbleBalance)

		userBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleTokenAddress, kibbleAddress),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)

		assert.EqualValues(t, test.CadenceUFix64("0.0"), userBalance)
	})

	t.Run("Should be able to withdraw and deposit tokens from a vault", func(t *testing.T) {
		tx := flow.NewTransaction().
			SetScript(kibble.TransferVaultScript(fungibleTokenAddress, kibbleAddress)).
			SetGasLimit(100).
			SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
			SetPayer(b.ServiceKey().Address).
			AddAuthorizer(kibbleAddress)

		_ = tx.AddArgument(test.CadenceUFix64("300.0"))
		_ = tx.AddArgument(cadence.NewAddress(userAddress))

		test.SignAndSubmit(
			t, b, tx,
			[]flow.Address{b.ServiceKey().Address, kibbleAddress},
			[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
			false,
		)

		// Assert that vault balances are correct

		kibbleBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleTokenAddress, kibbleAddress),
			[][]byte{jsoncdc.MustEncode(cadence.Address(kibbleAddress))},
		)

		assert.EqualValues(t, test.CadenceUFix64("700.0"), kibbleBalance)

		userBalance := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetBalanceScript(fungibleTokenAddress, kibbleAddress),
			[][]byte{jsoncdc.MustEncode(cadence.Address(userAddress))},
		)

		assert.EqualValues(t, test.CadenceUFix64("300.0"), userBalance)

		supply := test.ExecuteScriptAndCheck(
			t, b,
			kibble.GetSupplyScript(fungibleTokenAddress, kibbleAddress),
			nil,
		)
		assert.EqualValues(t, test.CadenceUFix64("1000.0"), supply)
	})
}
