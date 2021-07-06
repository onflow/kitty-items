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
exports.SaleOfferHandler = void 0;
const fcl = __importStar(require("@onflow/fcl"));
const base_event_handler_1 = require("./base-event-handler");
class SaleOfferHandler extends base_event_handler_1.BaseEventHandler {
    constructor(marketService, blockCursorService, flowService) {
        super(blockCursorService, flowService, []);
        this.marketService = marketService;
        this.eventCollectionInsertedSaleOffer = `A.${fcl.sansPrefix(marketService.marketAddress)}.KittyItemsMarket.CollectionInsertedSaleOffer`;
        this.eventCollectionRemovedSaleOffer = `A.${fcl.sansPrefix(marketService.marketAddress)}.KittyItemsMarket.CollectionRemovedSaleOffer`;
        this.eventNames = [
            this.eventCollectionInsertedSaleOffer,
            this.eventCollectionRemovedSaleOffer,
        ];
    }
    async onEvent(event) {
        switch (event.type) {
            case this.eventCollectionInsertedSaleOffer:
                await this.marketService.addSaleOffer(event);
                break;
            case this.eventCollectionRemovedSaleOffer:
                await this.marketService.removeSaleOffer(event);
                break;
            default:
                return;
        }
    }
}
exports.SaleOfferHandler = SaleOfferHandler;
