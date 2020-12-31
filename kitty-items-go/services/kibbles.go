package services

import (
	"context"
	"fmt"
	"log"

	"github.com/dapperlabs/kitty-items-go/templates"
	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk"
)

type KibblesService struct {
	flowService *FlowService
}

func NewKibbles(service *FlowService) *KibblesService {
	return &KibblesService{service}
}

// Mint sends a transaction to the Flow blockchain and returns the generated transactionID as a string.
func (k *KibblesService) Mint(ctx context.Context, destinationAddress flow.Address, amount uint) (string, error) {
	log.Printf("minting kibbles to address=%s", destinationAddress.String())
	sequenceNumber, err := k.flowService.GetMinterAddressSequenceNumber(ctx)
	if err != nil {
		return "", fmt.Errorf("error getting sequence number = %w", err)
	}

	referenceBlock, err := k.flowService.client.GetLatestBlock(ctx, true)
	if err != nil {
		return "", fmt.Errorf("error getting reference block = %w", err)
	}

	tx := flow.NewTransaction().
		SetScript([]byte(templates.MintKibblesTemplate)).
		SetProposalKey(k.flowService.minterAddress, k.flowService.minterAccountKey.Index, sequenceNumber).
		SetPayer(k.flowService.minterAddress).
		SetReferenceBlockID(referenceBlock.ID).
		SetGasLimit(100)

	if err := tx.AddArgument(cadence.NewAddress(destinationAddress)); err != nil {
		return "", err
	}

	if err := tx.AddArgument(cadence.NewUInt(amount)); err != nil {
		return "", err
	}

	return k.flowService.Send(ctx, tx)
}
