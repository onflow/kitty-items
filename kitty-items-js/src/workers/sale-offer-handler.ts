import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { EventDetails, BaseEventHandler } from "./base-event-handler";
import { SaleOffer } from "../models/sale-offer";
import { MarketService } from "../services/market";

class SaleOfferHandler extends BaseEventHandler {
  constructor(
    blockCursorService: BlockCursorService,
    flowService: FlowService,
    private readonly marketService: MarketService,
    eventName: string
  ) {
    super(blockCursorService, flowService, eventName);
  }

  async onEvent(details: EventDetails, payload: any): Promise<void> {
    const saleOffer = payload as SaleOffer;
    console.log("saleOffer", saleOffer);
  }
}

export { SaleOfferHandler };
