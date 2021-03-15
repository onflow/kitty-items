import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";

import { BlockCursor } from "../models/block-cursor";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

interface EventDetails {}

// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
abstract class BaseEventHandler {
  private stepSize: number = 1000;
  private stepTimeMs: number = 1000;
  private blockThreshold: number = Number(process.env.BLOCK_THRESHOLD!);
  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    private readonly eventNames: string[]
  ) {}

  async run() {
    console.log("fetching latest block height");
    let latestBlockHeight = await this.flowService.getLatestBlockHeight();
    console.log("latestBlockHeight =", latestBlockHeight.height);

    let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(
      "SALE_OFFER_EVENTS",
      latestBlockHeight.height
    );

    if (!blockCursor) {
      throw new Error("Could not get block cursor.");
    }

    // loop
    let fromBlock, toBlock;

    while (true) {
      await this.sleep(this.stepTimeMs);
      try {
        // calculate fromBlock, toBlock
        ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
      } catch (e) {
        console.warn("Error retrieving block range");
        continue;
      }

      // make sure we query the access node only when we have a substantial gap
      // between from and to block ranges; currently if we query the access node
      // when the gap is too narrow, it returns an error.
      const blockDiff = toBlock - fromBlock;
      if (blockDiff < this.blockThreshold) {
        console.log("Skipping block, blockDiff = ", blockDiff);
        continue;
      }

      // do our processing
      let getEventsResult, eventList;

      try {
        // `getEventsResult` will retrieve all events of the given type within the block height range supplied.
        // See https://docs.onflow.org/core-contracts/access-api/#geteventsforheightrange
        getEventsResult = await Promise.all([
          ...this.eventNames.map((name) =>
            send([getEvents(name, fromBlock, toBlock)])
          ),
        ]).catch((e) => {
          console.log("Error getting events:", e);
        });

        eventList = await Promise.all([
          ...getEventsResult.map((result) => fcl.decode(result)),
        ]).catch((e) => {
          console.log("Error creating event list:", e);
        });

        eventList = eventList.flat();
      } catch (e) {
        console.error(
          `Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
          e
        );
        continue;
      }

      // Note: Events may be "processed" out of order.
      await Promise.all([
        ...eventList.map((event) => this.processAndCatchEvent({}, event)),
      ]).catch((e) => {
        console.log("Error processing events:", e);
      });

      // update cursor
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }
  }

  private async processAndCatchEvent(eventDetails, event) {
    try {
      await this.onEvent(eventDetails, event);
    } catch (e) {
      // If we get an error, we're just continuing the loop for now, but they in a production graded app they should
      // be handled accordingly!
      console.error("Error processing event", e);
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
