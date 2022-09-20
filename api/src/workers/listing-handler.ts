/**
 * Listing Event Handler
 *
 * This worker extends Base Event Handler & listens for Listing events from Flow.
 * It will run callback functions to INSERT or DELETE entries from the listing table.
 *
 */
import * as fcl from "@onflow/fcl";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { StorefrontService } from "../services/storefront";
import { BaseEventHandler } from "./base-event-handler";

class ListingHandler extends BaseEventHandler {
  private eventListingAvailable;
  private eventListingCompleted;

  constructor(
    private readonly storefrontService: StorefrontService,
    blockCursorService: BlockCursorService,
    flowService: FlowService
  ) {
    super(blockCursorService, flowService, []);

    this.eventListingAvailable = `A.${fcl.sansPrefix(
      storefrontService.storefrontAddress
    )}.NFTStorefrontV2.ListingAvailable`;

    this.eventListingCompleted = `A.${fcl.sansPrefix(
      storefrontService.storefrontAddress
    )}.NFTStorefrontV2.ListingCompleted`;

    this.eventNames = [
      this.eventListingAvailable,
      this.eventListingCompleted
    ];
  }

  async onEvent(event: any): Promise<void> {
    switch (event.type) {
      case this.eventListingAvailable:
        await this.storefrontService.addListing(event);
        break;
      case this.eventListingCompleted:
        await this.storefrontService.removeListing(event);
        break;
      default:
        return;
    }
  }
}

export { ListingHandler };
