package main

import (
	"net/http"

	"github.com/dapperlabs/kitty-items-be/controllers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	kibblesC := controllers.NewKibbles()

	r.HandleFunc("/kibbles/new", kibblesC.HandleMintKibbles).Methods(http.MethodPost)

	if err := http.ListenAndServe(":8080", r); err != nil {
		panic(err)
	}
}
