package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type kibblesController struct {
}

type MintKibblesBody struct {
	FlowAddress string `json:"flowAddress"`
	Amount      uint   `json:"amount"`
}

func NewKibbles() *kibblesController {
	return &kibblesController{}
}

func (k *kibblesController) HandleMintKibbles(w http.ResponseWriter, r *http.Request) {
	body := &MintKibblesBody{}
	if err := json.NewDecoder(r.Body).Decode(body); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	fmt.Printf("body = %+v", body)
	w.WriteHeader(http.StatusOK)
}
