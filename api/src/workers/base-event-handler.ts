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
    console.log("Processing events:", JSON.stringify(this.eventNames, null, 2));
    console.log("fetching latest block height");
    let latestBlockHeight = await this.flowService.getLatestBlockHeight();
    console.log("latestBlockHeight =", latestBlockHeight.height);

    const cursors = this.eventNames.map((eventName) => {
      const cursor = this.blockCursorService.findOrCreateLatestBlockCursor(
        latestBlockHeight.height,
        eventName
      );
      return { cursor, eventName };
    });

    if (!cursors || !cursors.length) {
      throw new Error("Could not get block cursor from database.");
    }

    cursors.forEach(({ cursor, eventName }) => {
      // async event polling loop
      let keepLooping = true;
      const loopIt = async () => {
        let blockCursor = await cursor;
        let fromBlock, toBlock;
        await this.sleep(this.stepTimeMs);
        try {
          // calculate fromBlock, toBlock
          ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
        } catch (e) {
          console.warn("Error retrieving block range:", e);
        }

        // make sure we query the access node only when we have a substantial gap
        // between from and to block ranges; currently if we query the access node
        // when the gap is too narrow, it returns an error.
        const blockDiff = toBlock - fromBlock;
        if (blockDiff < this.blockThreshold) {
          console.log("Skipping block, blockDiff = ", blockDiff);
        }

        try {
          // `getEventsResult` will retrieve all events of the given type within the block height range supplied.
          // See https://docs.onflow.org/core-contracts/access-api/#geteventsforheightrange
          const result = await send([getEvents(eventName, fromBlock, toBlock)]);
          const decoded = await fcl.decode(result);

          if (decoded.length) {
            decoded.forEach(async (event) => await this.onEvent(event));
          }

          // update cursor
          blockCursor = await this.blockCursorService.updateBlockCursorById(
            blockCursor.id,
            toBlock
          );
        } catch (e) {
          console.error(
            `Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
            e
          );
        }
        if (keepLooping) {
          setTimeout(loopIt, 0);
        }
      };
      loopIt();
    });
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
