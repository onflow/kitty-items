/**
 * Base Event Handler
 *
 * This will iterate through a range of block_heights and then run a callback to process any events we
 * are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
 *
 */
import * as fcl from "@onflow/fcl";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";


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
        eventName,
        startingBlockHeight
      );
      return { cursor, eventName };
    });

    if (!cursors || !cursors.length) {
      throw new Error("Could not get block cursor from database.");
    }
    // this async foreach is fetching blockcursors.
    // the issue is that the listing available poll is checking blocks 19-20 for listing available events
    // the listing completed event is on block 20
    // the listing available event is on block 19
    // need to update from block on both events

    // todo maybe: put the cursors.foreach inside the poll method but keep it async.
    // maybe? set a class var for from block that gets updated by both polls
    // have 1 poll function that up
      const poll = async () => {
        for (const eventName of this.eventNames) {

          let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(eventName);
          let fromBlock, toBlock;
          // console.log("blockcursor: " + JSON.stringify(blockCursor));
          try {
            // Calculate block range to search
            ({ fromBlock, toBlock } = await this.getBlockRange(
              blockCursor,
              startingBlockHeight
            ));
            console.log(
              `Checking Block range for: ${eventName} fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${toBlock}`
            );
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
                for (const event of decoded) {
                  await this.onEvent(event);
                }
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
        }
        setTimeout(poll, this.stepTimeMs);
    }
    poll();
  };

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



    return Object.assign({}, { fromBlock, toBlock });
  }
}

export { BaseEventHandler };
