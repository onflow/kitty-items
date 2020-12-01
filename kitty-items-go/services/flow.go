package services

import (
	"context"

	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
	"github.com/onflow/flow-go-sdk/crypto"
)

type FlowService struct {
	signer           crypto.Signer
	minterAddress    *flow.Address
	minterAccountKey *flow.AccountKey
	client           *client.Client
}

func NewFlow(client *client.Client, signer crypto.Signer, minterAddress *flow.Address, minterAccountKey *flow.AccountKey) FlowService {
	return FlowService{
		signer:           signer,
		minterAddress:    minterAddress,
		minterAccountKey: minterAccountKey,
		client:           client,
	}
}

func (f *FlowService) Send(ctx context.Context, tx *flow.Transaction) (string, error) {
	// account that is signing the envelope, the reference to the key signing it, and a signer per-se
	err := tx.SignEnvelope(*f.minterAddress, f.minterAccountKey.Index, f.signer)
	if err != nil {
		return "", err
	}

	err = f.client.SendTransaction(ctx, *tx)
	if err != nil {
		return "", err
	}

	return tx.ID().String(), nil
}
