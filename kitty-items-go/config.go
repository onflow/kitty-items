package main

type Config struct {
	FlowNode             string `default:"localhost:3569"`
	MinterFlowAddressHex string `required:"true"`
	MinterPrivateKeyHex  string `required:"true"`
	MinterSigAlgoName    string `default:"ECDSA_P256"`
	MinterHashAlgoName   string `default:"SHA3_256"`
}
