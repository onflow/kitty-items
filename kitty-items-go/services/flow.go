package services

import (
	"context"

	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
	"github.com/onflow/flow-go-sdk/crypto"
)

type FlowService struct {
	signer           crypto.Signer
	minterAddress    flow.Address
	minterAccountKey *flow.AccountKey
	client           *client.Client
}

func NewFlow(client *client.Client, signer crypto.Signer, minterAddress flow.Address, minterAccountKey *flow.AccountKey) *FlowService {
	return &FlowService{
		signer:           signer,
		minterAddress:    minterAddress,
		minterAccountKey: minterAccountKey,
		client:           client,
	}
}

// Send will submit a transaction on the blockchain with the given minterAddress
func (f *FlowService) Send(ctx context.Context, tx *flow.Transaction) (string, error) {
	if err := tx.SignEnvelope(f.minterAddress, f.minterAccountKey.Index, f.signer); err != nil {
		return "", err
	}

	if err := f.client.SendTransaction(ctx, *tx); err != nil {
		return "", err
	}

	return tx.ID().String(), nil
}

func (f *FlowService) GetMinterAddressSequenceNumber(ctx context.Context) (uint64, error) {
	flowAccount, err := f.client.GetAccount(ctx, f.minterAddress)
	if err != nil {
		return 0, err
	}

	return flowAccount.Keys[f.minterAccountKey.Index].SequenceNumber, nil
}
