package main

import (
	"fmt"

	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/crypto"
)

type Config struct {
	FlowNode              string `default:"localhost:3569"`
	MinterFlowAddressHex  string `required:"true"`
	MinterPrivateKeyHex   string `required:"true"`
	MinterSigAlgoName     string `default:"ECDSA_P256"`
	MinterHashAlgoName    string `default:"SHA3_256"`
	MinterAccountKeyIndex int    `default:"0"`

	// These are computed variables based on the env variables above
	MinterFlowAddress flow.Address      `ignored:"true"`
	MinterPrivateKey  crypto.PrivateKey `ignored:"true"`
}

// Compute sanitizes and converts configurations to their proper types for flow
func (c *Config) Compute() (err error) {
	c.MinterFlowAddress = flow.HexToAddress(c.MinterFlowAddressHex)
	c.MinterPrivateKey, err = crypto.DecodePrivateKeyHex(crypto.StringToSignatureAlgorithm(c.MinterSigAlgoName), c.MinterPrivateKeyHex)
	if err != nil {
		return fmt.Errorf("error decrypting private key: %w", err)
	}
	return nil
}
