package main

import (
	"context"
	"log"
	"net/http"

	"github.com/dapperlabs/kitty-items-go/controllers"
	"github.com/dapperlabs/kitty-items-go/services"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
	"github.com/onflow/flow-go-sdk/crypto"
	"google.golang.org/grpc"
)

func main() {
	var conf Config

	if err := envconfig.Process("KITTY_ITEMS", &conf); err != nil {
		log.Fatalf("error parsing configuration = %s", err)
	}

	c, err := client.New(conf.FlowNode, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("error connecting to flow node = %s", err)
	}

	ctx := context.Background()

	minterPrivateKey, err := crypto.DecodePrivateKeyHex(crypto.StringToSignatureAlgorithm(conf.MinterSigAlgoName), conf.MinterPrivateKeyHex)
	if err != nil {
		log.Fatalf("error decoding minter private key = %s", err)
	}

	minterAddress := flow.HexToAddress(conf.MinterFlowAddressHex)
	minterAccount, err := c.GetAccount(ctx, minterAddress)
	if err != nil {
		log.Fatalf("error retrieving minter account = %s", err)
	}

	minterAccountKey := minterAccount.Keys[0]

	signer := crypto.NewInMemorySigner(minterPrivateKey, minterAccountKey.HashAlgo)

	flowService := services.NewFlow(c, signer, &minterAddress, minterAccountKey)
	log.Printf("flowService = %+v", flowService)

	kibblesService := services.NewKibbles(c)

	r := mux.NewRouter()

	kibblesC := controllers.NewKibbles(kibblesService)

	r.HandleFunc("/kibbles/new", kibblesC.HandleMintKibbles).Methods(http.MethodPost)

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting server = %s", err)
	}
}
