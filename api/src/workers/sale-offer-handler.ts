import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

import { EventDetails, BaseEventHandler } from "./base-event-handler";

import { getConfig } from "../config";

class SaleOfferHandler extends BaseEventHandler {
  private readonly config;
  constructor(
    private readonly marketService: MarketService,
    blockCursorService: BlockCursorService,
    flowService: FlowService,
    eventNames: string[]
  ) {
    super(blockCursorService, flowService, eventNames);
    this.config = getConfig();
  }

  async onEvent(details: EventDetails, event: any): Promise<void> {
    console.log("[saleOfferWorker] saw [Kitty Items] event:", event, details);

    switch (true) {
      case event.type === this.config.eventCollectionInsertedSaleOffer:
        this.marketService.addSaleOffer(event);
        break;
      case event.type === this.config.eventCollectionRemovedSaleOffer:
        this.marketService.removeSaleOffer(event);
        break;
      default:
        return;
    }
  }
}

export { SaleOfferHandler };
