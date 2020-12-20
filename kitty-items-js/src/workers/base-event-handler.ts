import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";

interface EventDetails {
  blockHeight: number;
}

abstract class BaseEventHandler {
  abstract eventName: string;
  private stepSize: number = 1000;
  private stepTimeMs: number = 500;
  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService
  ) {}

  async run() {
    console.log("fetching latest block height");
    let latestBlockHeight = await this.flowService.getLatestBlockHeight();
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

    while (true) {
      await this.sleep(this.stepTimeMs);
      // grab latest block
      // calculate fromBlock, toBlock
      latestBlockHeight = await this.flowService.getLatestBlockHeight();
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

      for (let i = 0; i < eventList.length; i++) {
        console.log(
          "event height=",
          getEventsResult.events[i].blockHeight,
          "payload=",
          eventList[i].data
        );
        await this.onEvent(
          { blockHeight: getEventsResult.events[i].blockHeight },
          eventList[i].data
        );
      }

      // update cursor
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }
  }

  abstract onEvent(details: EventDetails, payload: any): Promise<void>;

  private sleep(ms = 5000) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
}

export { BaseEventHandler, EventDetails };
