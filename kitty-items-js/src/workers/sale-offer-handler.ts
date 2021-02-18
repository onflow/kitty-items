import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

import { EventDetails, BaseEventHandler } from "./base-event-handler";

interface SaleOfferCreated {
  itemID: number;
  price: number;
}

class SaleOfferHandler extends BaseEventHandler {
  constructor(
    blockCursorService: BlockCursorService,
    flowService: FlowService,
    private readonly marketService: MarketService,
    eventNames: string[]
  ) {
    super(blockCursorService, flowService, eventNames);
  }

  async onEvent(details: EventDetails, event: any): Promise<void> {
    switch (event.type) {
      case process.env.EVENT_SALE_OFFER_CREATED:
        await this.marketService.upsertSaleOffer(
          event.data.itemID,
          event.data.price
        );
      case process.env.EVENT_SALE_OFFER_ACCEPTED:
        await this.marketService.upsertSaleOffer(event.data.itemID, 0, true);
      case process.env.EVENT_SALE_OFFER_FINISHED:
      case process.env.EVENT_COLLECTION_INSERTED_SALE_OFFER:
      case process.env.EVENT_COLLECTION_REMOVED_SALE_OFFER:
        await this.marketService.removeSaleOffer(event.data.saleItemID);
      default:
        console.warn("Got unknown event type in SaleOfferHandler:", {});
    }
  }
}

export { SaleOfferHandler };
