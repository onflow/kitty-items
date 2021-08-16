import * as fcl from "@onflow/fcl";

import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
abstract class BaseEventHandler {
  private stepSize: number = 200;
  private stepTimeMs: number = 1000;

  protected constructor(
    private readonly blockCursorService: BlockCursorService,
    private readonly flowService: FlowService,
    public eventNames: string[]
  ) {}

  async run() {
    console.log("fetching latest block height");

    let startingBlockHeight = await this.flowService.getLatestBlockHeight();

    // TODO: remove this once SDK fix is released: https://github.com/onflow/flow-js-sdk/pull/714
    if (startingBlockHeight === 0) {
      startingBlockHeight = 1;
    }

    console.log("latestBlockHeight =", startingBlockHeight);

    const cursors = this.eventNames.map((eventName) => {
      const cursor = this.blockCursorService.findOrCreateLatestBlockCursor(
        startingBlockHeight,
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
          ({ fromBlock, toBlock } = await this.getBlockRange(
            blockCursor,
            startingBlockHeight
          ));
        } catch (e) {
          console.warn("Error retrieving block range:", e);
        }

        if (fromBlock <= toBlock) {
          try {
            const result = await fcl.send([
              fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock)
            ]);
            const decoded = await fcl.decode(result);

            if (decoded.length) {
              decoded.forEach(async (event) => await this.onEvent(event));
              // Record the last block that we saw an event for
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
        }

        setTimeout(poll, this.stepTimeMs);
      };
      poll();
    });
  }

  abstract onEvent(event: any): Promise<void>;

  private async getBlockRange(blockCursor, startingBlockHeight) {
    let fromBlock =
      startingBlockHeight < blockCursor.currentBlockHeight
        ? blockCursor.currentBlockHeight
        : startingBlockHeight;

    let toBlock = await this.flowService.getLatestBlockHeight();

    if (toBlock - fromBlock > this.stepSize) {
      fromBlock = toBlock - 1;
      toBlock = await this.flowService.getLatestBlockHeight();
    }

    if (fromBlock > toBlock) {
      fromBlock = toBlock;
      toBlock = blockCursor.currentBlockHeight;
    }

    console.log(
      `fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${toBlock}`
    );

    return Object.assign({}, { fromBlock, toBlock });
  }
}

export { BaseEventHandler };
