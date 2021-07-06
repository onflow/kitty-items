"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventHandler = void 0;
const fcl = __importStar(require("@onflow/fcl"));
// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
class BaseEventHandler {
    constructor(blockCursorService, flowService, eventNames) {
        this.blockCursorService = blockCursorService;
        this.flowService = flowService;
        this.eventNames = eventNames;
        this.stepSize = 200;
        this.stepTimeMs = 1000;
        this.latestBlockOffset = 1;
    }
    async run() {
        console.log("fetching latest block height");
        let startingBlockHeight = await this.flowService.getLatestBlockHeight();
        console.log("latestBlockHeight =", startingBlockHeight);
        const cursors = this.eventNames.map((eventName) => {
            const cursor = this.blockCursorService.findOrCreateLatestBlockCursor(startingBlockHeight, eventName);
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
                    ({ fromBlock, toBlock } = await this.getBlockRange(blockCursor, startingBlockHeight));
                }
                catch (e) {
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
                            // Record the last block that we saw an event for
                            blockCursor = await this.blockCursorService.updateBlockCursorById(blockCursor.id, toBlock);
                        }
                    }
                    catch (e) {
                        console.error(`Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`, e);
                    }
                }
                setTimeout(poll, this.stepTimeMs);
            };
            poll();
        });
    }
    async getBlockRange(blockCursor, startingBlockHeight) {
        let fromBlock = startingBlockHeight < blockCursor.currentBlockHeight
            ? blockCursor.currentBlockHeight
            : startingBlockHeight;
        let toBlock = await this.flowService.getLatestBlockHeight();
        if (toBlock - fromBlock > this.stepSize) {
            fromBlock = toBlock - 1;
            toBlock = await this.flowService.getLatestBlockHeight();
        }
        console.log(`fromBlock=${fromBlock} toBlock=${toBlock} latestBlock=${toBlock}`);
        return Object.assign({}, { fromBlock, toBlock });
    }
}
exports.BaseEventHandler = BaseEventHandler;
