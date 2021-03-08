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
      case process.env.EVENT_COLLECTION_INSERTED_SALE_OFFER:
        this.marketService.addSaleOffer(event);
        break;
      case process.env.EVENT_COLLECTION_REMOVED_SALE_OFFER:
        this.marketService.removeSaleOffer(event);
        break;
      default:
        return;
    }
  }
}

export { SaleOfferHandler };
