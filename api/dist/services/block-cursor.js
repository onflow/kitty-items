"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCursorService = void 0;
const block_cursor_1 = require("../models/block-cursor");
class BlockCursorService {
    async findOrCreateLatestBlockCursor(latestBlockHeight, eventName) {
        let blockCursor = await block_cursor_1.BlockCursor.query().findOne({
            event_name: eventName,
        });
        if (!blockCursor) {
            blockCursor = await block_cursor_1.BlockCursor.query().insertAndFetch({
                event_name: eventName,
                current_block_height: latestBlockHeight,
            });
        }
        return blockCursor;
    }
    async updateBlockCursorById(id, currentBlockHeight) {
        return block_cursor_1.BlockCursor.query().updateAndFetchById(id, {
            current_block_height: currentBlockHeight,
        });
    }
}
exports.BlockCursorService = BlockCursorService;
