package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"log"

	"github.com/dapperlabs/kitty-items-go/services"
	"github.com/onflow/flow-go-sdk"
)

type kibblesController struct {
	kibblesService *services.KibblesService
}

type MintKibblesRequest struct {
	FlowAddress string `json:"flowAddress"`
	Amount      uint   `json:"amount"`
}

type MintKibblesResponse struct {
	TransactionID string `json:"transactionId"`
}

func NewKibbles(k *services.KibblesService) *kibblesController {
	return &kibblesController{k}
}

func (k *kibblesController) HandleMintKibbles(w http.ResponseWriter, r *http.Request) {
	body := &MintKibblesRequest{}
	if err := json.NewDecoder(r.Body).Decode(body); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if strings.HasPrefix(body.FlowAddress, "0x") {
		http.Error(w, "invalid flow address: remove 0x", http.StatusBadRequest)
		return
	}

	log.Printf("minting kibbles request = %+v", *body)

	flowDestinationAddress := flow.HexToAddress(body.FlowAddress)
	transactionID, err := k.kibblesService.Mint(r.Context(), flowDestinationAddress, body.Amount)

	if err != nil {
		log.Printf("error minting tokens = %s", err)
		http.Error(w, "error minting tokens", http.StatusInternalServerError)
		return
	}

	log.Printf("minted kibbles txId=%s", transactionID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&MintKibblesResponse{transactionID})
}
