/**
 * Block Cursor Service
 * 
 * Service class used to query the block_cursor table to READ/INSERT/UPDATE block cursors for relative events.
 *
 */
import { BlockCursor } from "../models/block-cursor";
import { v4 } from 'uuid';
class BlockCursorService {

  async findOrCreateLatestBlockCursor(
    latestBlockHeight?: number,
  ) {
    let blockCursor: BlockCursor;
    // expect table to only return 1 row for latest block_cursor checked.
    let blockCursors = await BlockCursor.query();

    if (blockCursors.length < 1) {
      blockCursor = await BlockCursor.query().insertAndFetch({
        id: v4(),
        current_block_height: latestBlockHeight,
      });
    } else {
      blockCursor = blockCursors[0];
    }
    
    return blockCursor;
  }

  async updateBlockCursorById(id: string, currentBlockHeight: number) {
    return BlockCursor.query().updateAndFetchById(id, {
      current_block_height: currentBlockHeight,
    });
  }
}

export { BlockCursorService };
