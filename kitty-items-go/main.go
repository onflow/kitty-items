package main

import (
	"log"
	"net/http"

	"github.com/dapperlabs/kitty-items-go/controllers"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"github.com/onflow/flow-go-sdk/client"
	"google.golang.org/grpc"
)

func main() {
	var conf Config

	if err := envconfig.Process("KITTY_ITEMS", &conf); err != nil {
		log.Fatalf("error parsing configuration = %s", err)
	}

	_, err := client.New(conf.FlowNode, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("error connecting to flow node = %s", err)
	}

	r := mux.NewRouter()

	kibblesC := controllers.NewKibbles()

	r.HandleFunc("/kibbles/new", kibblesC.HandleMintKibbles).Methods(http.MethodPost)

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting server = %s", err)
	}
}
