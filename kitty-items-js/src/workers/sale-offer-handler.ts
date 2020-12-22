import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { EventDetails, BaseEventHandler } from "./base-event-handler";
import { MarketService } from "../services/market";

interface SaleOfferCreated {
  itemId: number;
  price: number;
}

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
    const saleOfferEvent = payload as SaleOfferCreated;
    const saleOffer = await this.marketService.upsertSaleOffer(
      saleOfferEvent.itemId,
      saleOfferEvent.price
    );
    console.log("inserted sale offer = ", saleOffer);
  }
}

export { SaleOfferHandler };
