import { BlockCursor } from "../models/block-cursor";

class BlockCursorService {
  async findOrCreateLatestBlockCursor(
    eventName: string,
    latestBlockHeight: number
  ) {
    const blockCursor = await BlockCursor.query().findOne({
      flow_event_name: eventName,
    });
    if (!blockCursor) {
      return BlockCursor.query().insertAndFetch({
        flow_event_name: eventName,
        current_block_height: latestBlockHeight,
      });
    }
  }
}

export { BlockCursorService };
