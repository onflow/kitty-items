import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";

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
    console.log("latestBlockHeight =", latestBlockHeight.height);
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
      const getEventsResult = await send([
        getEvents(this.eventName, fromBlock, toBlock),
      ]);
      const eventList = await fcl.decode(getEventsResult);
      console.log("fetched event list", eventList, getEventsResult);

      for (let i = 0; i < eventList.length; i++) {
        console.log(
          "event height=",
          getEventsResult.events[i].blockHeight,
          "payload=",
          eventList[i].data
        );
      }

      console.log(`update cursor id=${blockCursor.id} toBlock=${toBlock}`);
      // update cursor
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }, this.stepTimeMs);
  }
}

export { SaleOfferHandler };
