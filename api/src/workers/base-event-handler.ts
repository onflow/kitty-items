import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";

import { BlockCursor } from "../models/block-cursor";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
abstract class BaseEventHandler {
  private stepSize: number = 1000;
  private stepTimeMs: number = 1000;
  private blockThreshold: number = Number(process.env.BLOCK_THRESHOLD!);

  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    public eventNames: string[]
  ) {}

  async run() {
    console.log("fetching latest block height");
    let latestBlockHeight = await this.flowService.getLatestBlockHeight();
    console.log("latestBlockHeight =", latestBlockHeight.height);

    let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(
      latestBlockHeight.height
    );

    if (!blockCursor) {
      throw new Error("Could not get block cursor from database.");
    }

    // loop
    let fromBlock, toBlock;

    while (true) {
      await this.sleep(this.stepTimeMs);
      try {
        // calculate fromBlock, toBlock
        ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
      } catch (e) {
        console.warn("Error retrieving block range:", e);
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

      try {
        // `getEventsResult` will retrieve all events of the given type within the block height range supplied.
        // See https://docs.onflow.org/core-contracts/access-api/#geteventsforheightrange

        // Process events in order they are specified in constructor
        this.eventNames.forEach(async (event) => {
          const result = await send([getEvents(event, fromBlock, toBlock)]);
          const decoded = await fcl.decode(result);
          if (decoded.length) {
            decoded.forEach(async (event) => await this.onEvent(event));
          }
        });
      } catch (e) {
        console.error(
          `Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
          e
        );
        continue;
      }

      // update cursor
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );
    }
  }

  abstract onEvent(event: any): Promise<void>;

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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export { BaseEventHandler };
