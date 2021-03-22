import { BlockCursor } from "../models/block-cursor";

class BlockCursorService {
  private readonly cursorLable: string = "BLOCK_CURSOR";
  async findOrCreateLatestBlockCursor(latestBlockHeight: number) {
    let blockCursor = await BlockCursor.query().findOne({
      cursor_label: this.cursorLabel,
    });
    if (!blockCursor) {
      blockCursor = await BlockCursor.query().insertAndFetch({
        cursor_label: this.cursorLable,
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
