import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";
import { BlockCursor } from "../models/block-cursor";

interface EventDetails {
  blockHeight: number;
}

abstract class BaseEventHandler {
  private stepSize: number = 1000;
  private stepTimeMs: number = 500;
  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    private readonly eventName: string
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
      try {
        // calculate fromBlock, toBlock
        ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
      } catch (e) {
        console.warn("error retrieving block range");
        continue;
      }

      if (fromBlock === toBlock) {
        return;
      }

      // do our processing
      let getEventsResult, eventList;

      try {
        getEventsResult = await send([
          getEvents(this.eventName, fromBlock, toBlock),
        ]);
        eventList = await fcl.decode(getEventsResult);
      } catch (e) {
        console.error(
          `error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
          e
        );
        continue;
      }

      for (let i = 0; i < eventList.length; i++) {
        console.log(
          "event height=",
          getEventsResult.events[i].blockHeight,
          "payload=",
          eventList[i].data
        );
        const blockHeight = getEventsResult.events[i].blockHeight;
        await this.processAndCatchEvent(blockHeight, eventList, i);
      }

      // update cursor
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }
  }

  private async processAndCatchEvent(blockHeight, eventList, i: number) {
    try {
      await this.onEvent({ blockHeight }, eventList[i].data);
    } catch (e) {
      // If we get an error, we're just continuing the loop for now, but they in a production graded app they should
      // be handled accordingly
      console.error(`error processing event block_height=${blockHeight}`, e);
    }
  }

  abstract onEvent(details: EventDetails, payload: any): Promise<void>;

  private async getBlockRange(currentBlockCursor: BlockCursor) {
    const latestBlockHeight = await this.flowService.getLatestBlockHeight();
    const fromBlock = currentBlockCursor.current_block_height;
    let toBlock = currentBlockCursor.current_block_height + this.stepSize;
    if (toBlock > latestBlockHeight.height) {
      toBlock = latestBlockHeight.height;
    }
    console.log(
      `fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${latestBlockHeight.height}`
    );
    return { fromBlock, toBlock };
  }

  private sleep(ms = 5000) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
}

export { BaseEventHandler, EventDetails };
