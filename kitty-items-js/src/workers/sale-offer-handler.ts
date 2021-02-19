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
    this.marketService.insertEventIfNotExists(event);
  }
}

export { SaleOfferHandler };
