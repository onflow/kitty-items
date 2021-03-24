import * as fcl from "@onflow/fcl";
import { send } from "@onflow/sdk-send";
import { getEvents } from "@onflow/sdk-build-get-events";

import { BlockCursor } from "../models/block-cursor";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
abstract class BaseEventHandler {
  private stepTimeMs: number = 1000;

  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    public eventNames: string[]
  ) {}

  async run() {
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

    cursors.forEach(async ({ cursor, eventName }) => {
      // async event polling loop

      let keepPolling = true;
      let blockCursor = await cursor;

      const poll = async () => {
        let fromBlock, toBlock;

        try {
          // calculate fromBlock, toBlock
          ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
        } catch (e) {
          console.warn("Error retrieving block range:", e);
        }

        try {
          // `getEventsResult` will retrieve all events of the given type within the block height range supplied.
          // See https://docs.onflow.org/core-contracts/access-api/#geteventsforheightrange
          const result = await send([getEvents(eventName, fromBlock, toBlock)]);
          const decoded = await fcl.decode(result);

          if (decoded.length) {
            decoded.forEach(async (event) => await this.onEvent(event));
            // Update cursor when we see events.
            blockCursor = await this.blockCursorService.updateBlockCursorById(
              blockCursor.id,
              toBlock
            );
          }
        } catch (e) {
          console.error(
            `Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
            e
          );
        }
        if (keepPolling) {
          setTimeout(poll, this.stepTimeMs);
        }
      };
      poll();
    });
  }

  abstract onEvent(event: any): Promise<void>;

  private async getBlockRange(currentBlockCursor: BlockCursor) {
    const latestBlockHeight = await this.flowService.getLatestBlockHeight();
    const fromBlock = currentBlockCursor.current_block_height;
    let toBlock = latestBlockHeight.height;

    if (toBlock > latestBlockHeight) toBlock = latestBlockHeight;

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
