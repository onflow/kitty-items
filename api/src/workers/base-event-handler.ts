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
    console.log("start event polling")
    const poll = async () => {
      console.log("fetching latest block height");
      let lastestBlockHeight = await this.flowService.getLatestBlockHeight();
      console.log("latestBlockHeight =", lastestBlockHeight);

      // if blockCursor does not exist, create one with lastest block height
      let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(lastestBlockHeight);
      
      if (!blockCursor || !blockCursor.id) {
        throw new Error("Could not get block cursor from database.");
      }

      // currentBlockHeight in the DB will equal the toBlock of the previous blockrange fcl query.
      // increment fromBlock by 1 for next window.
      let fromBlock = blockCursor.currentBlockHeight + 1;
      let toBlock = await this.flowService.getLatestBlockHeight();

      // on 1st iteration, fromBlock will be greater than toBlock due to newly inserted row.
      if (fromBlock > toBlock) {
        fromBlock = toBlock;
      }
      console.log(`Checking Block range fromBlock=${fromBlock} toBlock=${toBlock}`);

      // iterate over eventNames and fetch events for block range
      let events: any[] = [];
      for (const eventName of this.eventNames) {
          try {
            const result = await fcl.send([
              fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock)
            ]);
            const decoded: [] = await fcl.decode(result);
            if (decoded.length > 0) {
              events.push(...decoded);
            } 
          } catch (e) {
            console.error(
              `Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`,
              e
            );
          }
      }

      if (events.length > 0) {
        // sort events by blockHeight ascending
        events = events.sort((event1, event2) => {
          if (event1.blockHeight > event2.blockHeight) {
            return 1;
          } else if (event1.blockHeight < event2.blockHeight) {
            return  -1;
          } 
          return 0;
        });

        for (const event of events) {
          await this.onEvent(event);
        }
      }

      // Record the last block that queries events for
      blockCursor = await this.blockCursorService.updateBlockCursorById(
        blockCursor.id,
        toBlock
      );

      // recursively call self to continue polling
      setTimeout(poll, this.stepTimeMs);
    }
    // begin polling method. 
    poll();
  };

  abstract onEvent(event: any): Promise<void>;

}

export { BaseEventHandler };
