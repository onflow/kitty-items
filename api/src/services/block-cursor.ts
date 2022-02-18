import { BlockCursor } from "../models/block-cursor";
import { v4 } from 'uuid';
class BlockCursorService {
  async findOrCreateLatestBlockCursor(
    latestBlockHeight: number,
    eventName: string
  ) {
    let blockCursor = await BlockCursor.query().findOne({
      event_name: eventName,
    });
    if (!blockCursor) {
      blockCursor = await BlockCursor.query().insertAndFetch({
        id: v4(),
        event_name: eventName,
        current_block_height: latestBlockHeight,
      });
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
