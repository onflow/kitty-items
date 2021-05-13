import * as fcl from "@onflow/fcl";
import hash from "object-hash";

import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

import { BaseEventHandler } from "./base-event-handler";

class SaleOfferHandler extends BaseEventHandler {
  private eventCollectionInsertedSaleOffer;
  private eventCollectionRemovedSaleOffer;
  constructor(
    private readonly marketService: MarketService,
    blockCursorService: BlockCursorService,
    flowService: FlowService
  ) {
    super(blockCursorService, flowService, []);

    this.eventCollectionInsertedSaleOffer = `A.${fcl.sansPrefix(
      marketService.marketAddress
    )}.KittyItemsMarket.CollectionInsertedSaleOffer`;

    this.eventCollectionRemovedSaleOffer = `A.${fcl.sansPrefix(
      marketService.marketAddress
    )}.KittyItemsMarket.CollectionRemovedSaleOffer`;

    this.eventNames = [
      this.eventCollectionInsertedSaleOffer,
      this.eventCollectionRemovedSaleOffer,
    ];
  }

  async onEvent(event: any): Promise<void> {
    console.log("[saleOfferWorker] saw [Kitty Items] event:", event);

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

export { SaleOfferHandler };
