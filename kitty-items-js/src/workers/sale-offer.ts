import { BlockCursorService } from "../services/block-cursor";

class SaleOfferHandler {
  private eventName: string = "A.877931736ee77cff.TopShot.Deposit";
  constructor(private readonly blockCursorService: BlockCursorService) {}

  async run() {
    // create a cursor on the database
    const blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(
      this.eventName,
      18000000
    );
    console.log("retrieved blockcursor = ", blockCursor);
    // loop
    // grab latest block
    // calculate fromBlock, toBlock
    // we go step by step
    // do our processing
    // update cursor
  }
}

export { SaleOfferHandler };
