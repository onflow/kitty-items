import * as fcl from "@onflow/fcl";

import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

import { EventDetails, BaseEventHandler } from "./base-event-handler";

class SaleOfferHandler extends BaseEventHandler {
  private eventCollectionInsertedSaleOffer: string;
  private eventCollectionRemovedSaleOffer: string;

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
  }

  async onEvent(details: EventDetails, event: any): Promise<void> {
    console.log("[saleOfferWorker] saw [Kitty Items] event:", event, details);

    switch (event.type) {
      case this.eventCollectionInsertedSaleOffer:
        this.marketService.addSaleOffer(event);
        break;
      case this.eventCollectionRemovedSaleOffer:
        this.marketService.removeSaleOffer(event);
        break;
      default:
        return;
    }
  }
}

export { SaleOfferHandler };
