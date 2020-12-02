package services

import (
	"context"
	"fmt"

	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk"
)

const mintKibblesTemplate = `
import DietKibbles from 0x06f65a4f32bba850
import FungibleToken from 0x9a0766d93b6608b7

transaction(to: Address, amount: UInt) {
  prepare(to: AuthAccount) {
    getAccount(to)
      .getCapability<&{FungibleToken.Receiver}>(DietKibbles.publicPath)!
      .borrow()!
      .deposit(from: <- DietKibbles.mintTenDietKibbles())
  }
}
`

type KibblesService struct {
	flowService *FlowService
}

func NewKibbles(service *FlowService) *KibblesService {
	return &KibblesService{service}
}

// Mint sends a transaction to the Flow blockchain and returns the generated transactionID as a string.
func (k *KibblesService) Mint(ctx context.Context, destinationAddress flow.Address, amount uint) (string, error) {
	sequenceNumber, err := k.flowService.GetMinterAddressSequenceNumber(ctx)
	if err != nil {
		return "", fmt.Errorf("error getting sequence number = %w", err)
	}

	referenceBlock, err := k.flowService.client.GetLatestBlock(ctx, true)
	if err != nil {
		return "", fmt.Errorf("error getting reference block = %w", err)
	}

	tx := flow.NewTransaction().
		SetScript([]byte(mintKibblesTemplate)).
		AddAuthorizer(k.flowService.minterAddress).
		SetProposalKey(k.flowService.minterAddress, k.flowService.minterAccountKey.Index, sequenceNumber).
		SetPayer(k.flowService.minterAddress).
		SetReferenceBlockID(referenceBlock.ID).
		SetGasLimit(10000)

	if err := tx.AddArgument(cadence.NewAddress(destinationAddress)); err != nil {
		return "", err
	}

	if err := tx.AddArgument(cadence.NewUInt(amount)); err != nil {
		return "", err
	}

	txID, err := k.flowService.Send(ctx, tx)
	if err != nil {
		return "", err
	}

	return txID, nil
}
