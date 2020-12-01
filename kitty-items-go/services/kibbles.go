package services

import (
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
)

type KibblesService struct {
	*client.Client
}

func New(flowClient *client.Client) *KibblesService {
	return &KibblesService{flowClient}
}

// Mint sends a transaction to the Flow blockchain and returns the generated transactionID as a string.
func (k *KibblesService) Mint(flowAddress flow.Address, amount uint) (string, error) {
	return "", nil
}
