package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

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
	transactionID string `json:"transactionId"`
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

	flowAddress := flow.HexToAddress(body.FlowAddress)

	transactionID, err := k.kibblesService.Mint(flowAddress, body.Amount)

	if err != nil {
		http.Error(w, "error minting tokens", http.StatusInternalServerError)
	}

	fmt.Printf("transactionId = %s", transactionID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&MintKibblesResponse{transactionID})
}
