import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

class SaleOfferHandler {
  private eventName: string = "A.877931736ee77cff.TopShot.Deposit";
  private stepSize: number = 1000;
  private stepTimeMs: number = 3000;
  constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService
  ) {}

  async run() {
    console.log("fetching latest block height");
    const latestBlockHeight = await this.flowService.getLatestBlockHeight();
    // create a cursor on the database
    let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(
      this.eventName,
      latestBlockHeight.height
    );

    if (!blockCursor) {
      throw new Error(
        `invalid state, no block cursor defined for event_name=${this.eventName}`
      );
    }

    // loop
    let fromBlock, toBlock;

    setInterval(async () => {
      // grab latest block
      // calculate fromBlock, toBlock
      fromBlock = blockCursor.current_block_height;
      toBlock = blockCursor.current_block_height + this.stepSize;
      if (toBlock > latestBlockHeight.height) {
        toBlock = latestBlockHeight.height;
      }

      if (fromBlock === toBlock) {
        return;
      }

      console.log(
        `fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${latestBlockHeight.height}`
      );

      // do our processing
      // update cursor

      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }, this.stepTimeMs);
  }
}

export { SaleOfferHandler };
