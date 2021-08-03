package kibble

import (
	"regexp"
	"testing"
	"github.com/onflow/cadence"
	emulator "github.com/onflow/flow-emulator"
	ftcontracts "github.com/onflow/flow-ft/lib/go/contracts"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
	"github.com/onflow/flow-go-sdk/templates"
	sdktest "github.com/onflow/flow-go-sdk/test"
	"github.com/stretchr/testify/assert"

	"github.com/onflow/kitty-items/cadence/test/go/test"
)

const (
	kibbleRootPath           = "../.."
	kibbleContractPath       = kibbleRootPath + "/contracts/Kibble.cdc"
	kibbleSetupAccountPath   = kibbleRootPath + "/transactions/kibble/setup_account.cdc"
	kibbleTransferTokensPath = kibbleRootPath + "/transactions/kibble/transfer_tokens.cdc"
	kibbleMintTokensPath     = kibbleRootPath + "/transactions/kibble/mint_tokens.cdc"
	kibbleGetBalancePath     = kibbleRootPath + "/scripts/kibble/get_balance.cdc"
	kibbleGetSupplyPath      = kibbleRootPath + "/scripts/kibble/get_supply.cdc"
)

func DeployContracts(t *testing.T, b *emulator.Blockchain) (flow.Address, flow.Address, crypto.Signer) {
	accountKeys := sdktest.AccountKeyGenerator()

	// Should be able to deploy a contract as a new account with no keys.
	fungibleTokenCode := ftcontracts.FungibleToken()
	fungibleTokenAddress, err := b.CreateAccount(
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
	kibbleCode := LoadKibble(fungibleTokenAddress)

	kibbleAddress, err := b.CreateAccount(
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
	SetupAccount(t, b, kibbleAddress, kibbleSigner, fungibleTokenAddress, kibbleAddress)

	return fungibleTokenAddress, kibbleAddress, kibbleSigner
}

func SetupAccount(
	t *testing.T,
	b *emulator.Blockchain,
	userAddress flow.Address,
	userSigner crypto.Signer,
	fungibleAddress flow.Address,
	kibbleAddress flow.Address,
) {
	tx := flow.NewTransaction().
		SetScript(SetupKibbleAccountTransaction(fungibleAddress, kibbleAddress)).
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

func CreateAccount(
	t *testing.T,
	b *emulator.Blockchain,
	fungibleTokenAddress flow.Address,
	kibbleAddress flow.Address,
) (flow.Address, crypto.Signer) {
	userAddress, userSigner, _ := test.CreateAccount(t, b)
	SetupAccount(t, b, userAddress, userSigner, fungibleTokenAddress, kibbleAddress)
	return userAddress, userSigner
}

func Mint(
	t *testing.T,
	b *emulator.Blockchain,
	fungibleTokenAddress flow.Address,
	kibbleAddress flow.Address,
	kibbleSigner crypto.Signer,
	recipientAddress flow.Address,
	amount string,
	shouldRevert bool,
) {
	tx := flow.NewTransaction().
		SetScript(MintKibbleTransaction(fungibleTokenAddress, kibbleAddress)).
		SetGasLimit(100).
		SetProposalKey(b.ServiceKey().Address, b.ServiceKey().Index, b.ServiceKey().SequenceNumber).
		SetPayer(b.ServiceKey().Address).
		AddAuthorizer(kibbleAddress)

	_ = tx.AddArgument(cadence.NewAddress(recipientAddress))
	_ = tx.AddArgument(test.CadenceUFix64(amount))

	test.SignAndSubmit(
		t, b, tx,
		[]flow.Address{b.ServiceKey().Address, kibbleAddress},
		[]crypto.Signer{b.ServiceKey().Signer(), kibbleSigner},
		shouldRevert,
	)

}

func replaceAddressPlaceholders(code string, fungibleTokenAddress, kibbleAddress string) []byte {
	return []byte(test.ReplaceImports(
		code,
		map[string]*regexp.Regexp{
			fungibleTokenAddress: test.FungibleTokenAddressPlaceholder,
			kibbleAddress:        test.KibbleAddressPlaceHolder,
		},
	))
}

func LoadKibble(fungibleTokenAddress flow.Address) []byte {
	return []byte(test.ReplaceImports(
		string(test.ReadFile(kibbleContractPath)),
		map[string]*regexp.Regexp{
			fungibleTokenAddress.String(): test.FungibleTokenAddressPlaceholder,
		},
	))
}

func GetSupplyScript(fungibleTokenAddress, kibbleAddress flow.Address) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kibbleGetSupplyPath)),
		fungibleTokenAddress.String(),
		kibbleAddress.String(),
	)
}

func GetBalanceScript(fungibleTokenAddress, kibbleAddress flow.Address) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kibbleGetBalancePath)),
		fungibleTokenAddress.String(),
		kibbleAddress.String(),
	)
}
func TransferVaultScript(fungibleTokenAddress, kibbleAddress flow.Address) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kibbleTransferTokensPath)),
		fungibleTokenAddress.String(),
		kibbleAddress.String(),
	)
}

func SetupKibbleAccountTransaction(fungibleTokenAddress, kibbleAddress flow.Address) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kibbleSetupAccountPath)),
		fungibleTokenAddress.String(),
		kibbleAddress.String(),
	)
}

func MintKibbleTransaction(fungibleTokenAddress, kibbleAddress flow.Address) []byte {
	return replaceAddressPlaceholders(
		string(test.ReadFile(kibbleMintTokensPath)),
		fungibleTokenAddress.String(),
		kibbleAddress.String(),
	)
}
