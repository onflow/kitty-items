import * as fcl from "@onflow/fcl";

import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { StorefrontService } from "../services/storefront";

import { BaseEventHandler } from "./base-event-handler";

class SaleOfferHandler extends BaseEventHandler {
  private eventSaleOfferAvailable;
  private eventSaleOfferCompleted;

  constructor(
    private readonly storefrontService: StorefrontService,
    blockCursorService: BlockCursorService,
    flowService: FlowService
  ) {
    super(blockCursorService, flowService, []);

    this.eventSaleOfferAvailable = `A.${fcl.sansPrefix(
      storefrontService.storefrontAddress
    )}.NFTStorefront.SaleOfferAvailable`;

    this.eventSaleOfferCompleted = `A.${fcl.sansPrefix(
      storefrontService.storefrontAddress
    )}.NFTStorefront.SaleOfferCompleted`;

    this.eventNames = [
      this.eventSaleOfferAvailable,
      this.eventSaleOfferCompleted
    ];
  }

  async onEvent(event: any): Promise<void> {
    console.log("👀", event.type);

    switch (event.type) {
      case this.eventSaleOfferAvailable:
        await this.storefrontService.addSaleOffer(event);
        break;
      case this.eventSaleOfferCompleted:
        await this.storefrontService.removeSaleOffer(event);
        break;
      default:
        return;
    }
  }
}

export { SaleOfferHandler };
