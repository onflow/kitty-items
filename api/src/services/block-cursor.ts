import { BlockCursor } from "../models/block-cursor";

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
