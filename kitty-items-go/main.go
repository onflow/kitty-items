package main

import (
	"context"
	"log"
	"net/http"

	"github.com/dapperlabs/kitty-items-go/controllers"
	"github.com/dapperlabs/kitty-items-go/services"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/onflow/flow-go-sdk/client"
	"github.com/onflow/flow-go-sdk/crypto"
	"google.golang.org/grpc"
)

func main() {
	var conf Config

	// Parse environment variables with `KITTY_ITEMS` prefix into the Config struct
	if err := envconfig.Process("KITTY_ITEMS", &conf); err != nil {
		log.Fatalf("error parsing configuration = %s", err)
	}

	// Further process the environment variables so we can have more specific types and values on Config
	if err := conf.Compute(); err != nil {
		log.Fatalf("error processing configuration = %s", err)
	}

	flowClient, err := client.New(conf.FlowNode, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("error connecting to flow node = %s", err)
	}
	defer flowClient.Close()

	ctx := context.Background()

	// Retrieve the Flow Account with our configured minter address so we can create a transaction signer for it
	minterAccount, err := flowClient.GetAccount(ctx, conf.MinterFlowAddress)
	if err != nil {
		log.Fatalf("error retrieving minter account = %s", err)
	}

	log.Printf("Minter Account = %+v", minterAccount.Address)

	minterAccountKey := minterAccount.Keys[conf.MinterAccountKeyIndex]
	signer := crypto.NewInMemorySigner(conf.MinterPrivateKey, minterAccountKey.HashAlgo)

	// Instantiate our internal services
	flowService := services.NewFlow(flowClient, signer, conf.MinterFlowAddress, minterAccountKey)
	kibblesService := services.NewKibbles(flowService)

	r := mux.NewRouter()

	kibblesC := controllers.NewKibbles(kibblesService)
	r.HandleFunc("/kibbles/new", kibblesC.HandleMintKibbles).Methods(http.MethodPost)

	log.Printf("listening")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting server = %s", err)
	}
}
