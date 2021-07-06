"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const t = __importStar(require("@onflow/types"));
const fcl = __importStar(require("@onflow/fcl"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sale_offer_1 = require("../models/sale-offer");
const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const kibblePath = '"../../contracts/Kibble.cdc"';
const kittyItemsPath = '"../../contracts/KittyItems.cdc"';
const kittyItemsMarkPath = '"../../contracts/KittyItemsMarket.cdc"';
class MarketService {
    constructor(flowService, fungibleTokenAddress, kibbleAddress, nonFungibleTokenAddress, kittyItemsAddress, marketAddress) {
        this.flowService = flowService;
        this.fungibleTokenAddress = fungibleTokenAddress;
        this.kibbleAddress = kibbleAddress;
        this.nonFungibleTokenAddress = nonFungibleTokenAddress;
        this.kittyItemsAddress = kittyItemsAddress;
        this.marketAddress = marketAddress;
        this.setupAccount = () => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItemsMarket/setup_account.cdc`), "utf8")
                .replace(kittyItemsMarkPath, fcl.withPrefix(this.marketAddress));
            return this.flowService.sendTx({
                transaction,
                args: [],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.getItem = (account, itemID) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/cadence/kittyItemsMarket/scripts/get_collection_ids.cdc`), "utf8")
                .replace(kittyItemsMarkPath, fcl.withPrefix(this.marketAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)],
            });
        };
        this.getItems = (account) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/cadence/kittyItemsMarket/scripts/get_collection_ids.cdc`), "utf8")
                .replace(kittyItemsMarkPath, fcl.withPrefix(this.marketAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address)],
            });
        };
        this.buy = (account, itemID) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItemsMarket/buy_market_item.cdc`), "utf8")
                .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kibblePath, fcl.withPrefix(this.kibbleAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
                .replace(kittyItemsMarkPath, fcl.withPrefix(this.marketAddress));
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.sell = (itemID, price) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItemsMarket/create_sale_offer.cdc`), "utf8")
                .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kibblePath, fcl.withPrefix(this.kibbleAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
                .replace(kittyItemsMarkPath, fcl.withPrefix(this.marketAddress));
            return this.flowService.sendTx({
                transaction,
                args: [
                    fcl.arg(itemID, t.UInt64),
                    fcl.arg(price.toFixed(8).toString(), t.UFix64),
                ],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.addSaleOffer = async (saleOfferEvent) => {
            return sale_offer_1.SaleOffer.transaction(async (tx) => {
                return await sale_offer_1.SaleOffer.query(tx)
                    .insert({
                    sale_item_id: saleOfferEvent.data.itemID,
                    sale_item_type: saleOfferEvent.data.typeID,
                    sale_item_owner: saleOfferEvent.data.owner,
                    sale_price: saleOfferEvent.data.price,
                    transaction_id: saleOfferEvent.transactionId,
                })
                    // Don't throw an error if we're seeing the same event, just ignore it.
                    // (Don't attempt to insert)
                    .onConflict("sale_item_id")
                    .ignore()
                    .returning("transaction_id")
                    .catch((e) => {
                    console.log(e);
                });
            });
        };
        this.removeSaleOffer = (saleOfferEvent) => {
            return sale_offer_1.SaleOffer.transaction(async (tx) => {
                return await sale_offer_1.SaleOffer.query(tx)
                    .where({
                    sale_item_id: saleOfferEvent.data.itemID,
                })
                    .del();
            });
        };
        this.findMostRecentSales = () => {
            return sale_offer_1.SaleOffer.transaction(async (tx) => {
                const offers = await sale_offer_1.SaleOffer.query(tx).select("*");
                return offers;
            });
        };
    }
}
exports.MarketService = MarketService;
