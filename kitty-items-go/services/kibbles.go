package services

import (
	"context"

	"github.com/onflow/flow-go-sdk"
)

const mintKibblesTemplate = ``

type KibblesService struct {
	flowService *FlowService
}

func NewKibbles(service *FlowService) *KibblesService {
	return &KibblesService{service}
}

// Mint sends a transaction to the Flow blockchain and returns the generated transactionID as a string.
func (k *KibblesService) Mint(ctx context.Context, flowAddress flow.Address, amount uint) (string, error) {
	sequenceNumber, err := k.flowService.GetMinterAddressSequenceNumber(ctx)
	if err != nil {
		return "", err
	}

	tx := flow.NewTransaction().
		SetScript([]byte(mintKibblesTemplate)).
		AddAuthorizer(k.flowService.minterAddress).
		SetProposalKey(k.flowService.minterAddress, k.flowService.minterAccountKey.Index, sequenceNumber).
		SetPayer(k.flowService.minterAddress).
		SetGasLimit(10000)
	txID, err := k.flowService.Send(ctx, tx)
	if err != nil {
		return "", err
	}

	return txID, nil
}
