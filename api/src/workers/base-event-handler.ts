import * as fcl from "@onflow/fcl";

import { BlockCursor } from "../models/block-cursor";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
abstract class BaseEventHandler {
  private stepSize: number = 200;
  private stepTimeMs: number = 1000;
  private latestBlockOffset: number = 1;

  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    public eventNames: string[]
  ) {}

  async run() {
    console.log("fetching latest block height");

    let latestBlockHeight = await this.flowService.getLatestBlockHeight();

    console.log("latestBlockHeight =", latestBlockHeight);

    const cursors = this.eventNames.map((eventName) => {
      const cursor = this.blockCursorService.findOrCreateLatestBlockCursor(
        latestBlockHeight,
        eventName
      );
      return { cursor, eventName };
    });

    if (!cursors || !cursors.length) {
      throw new Error("Could not get block cursor from database.");
    }

    cursors.forEach(async ({ cursor, eventName }) => {
      let blockCursor = await cursor;

      const poll = async () => {
        let fromBlock, toBlock;

        try {
          // Calculate block range to search
          ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor));
        } catch (e) {
          console.warn("Error retrieving block range:", e);
        }

        if (fromBlock <= toBlock) {
          try {
            const result = await fcl.send([
              fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock),
            ]);
            const decoded = await fcl.decode(result);

            if (decoded.length) {
              decoded.forEach(async (event) => await this.onEvent(event));
            }

            // Record the last block that we synchronized up to
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
        }

        setTimeout(poll, this.stepTimeMs);
      };
      poll();
    });
  }

  abstract onEvent(event: any): Promise<void>;

  private async getBlockRange(currentBlockCursor: BlockCursor) {
    const latestBlockHeight =
      (await this.flowService.getLatestBlockHeight()) - this.latestBlockOffset;

    const fromBlock = currentBlockCursor.currentBlockHeight;
    let toBlock = currentBlockCursor.currentBlockHeight + this.stepSize;

    // Don't look ahead to unsealed blocks
    if (toBlock > latestBlockHeight) {
      toBlock = latestBlockHeight;
    }

    console.log(
      `fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${latestBlockHeight}`
    );

    return { fromBlock, toBlock };
  }
}

export { BaseEventHandler };
