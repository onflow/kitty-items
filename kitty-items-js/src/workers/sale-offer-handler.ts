import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { EventDetails, BaseEventHandler } from "./base-event-handler";
import { SaleOffersService } from "../services/sale-offers";
import { SaleOffer } from "../models/sale-offer";

class SaleOfferHandler extends BaseEventHandler {
  eventName: string = "A.f79ee844bfa76528.KittyItemsMarket.SaleOfferCreated";

  constructor(
    blockCursorService: BlockCursorService,
    flowService: FlowService,
    private readonly saleOfferService: SaleOffersService
  ) {
    super(blockCursorService, flowService);
  }

  async onEvent(details: EventDetails, payload: any): Promise<void> {
    const saleOffer = payload as SaleOffer;
    console.log("saleOffer", saleOffer);
  }
}

export { SaleOfferHandler };
