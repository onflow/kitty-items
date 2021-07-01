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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventHandler = void 0;
var fcl = __importStar(require("@onflow/fcl"));
// BaseEventHandler will iterate through a range of block_heights and then run a callback to process any events we
// are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
var BaseEventHandler = /** @class */ (function () {
    function BaseEventHandler(blockCursorService, flowService, eventNames) {
        this.blockCursorService = blockCursorService;
        this.flowService = flowService;
        this.eventNames = eventNames;
        this.stepSize = 200;
        this.stepTimeMs = 1000;
        this.latestBlockOffset = 1;
    }
    BaseEventHandler.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startingBlockHeight, cursors;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("fetching latest block height");
                        return [4 /*yield*/, this.flowService.getLatestBlockHeight()];
                    case 1:
                        startingBlockHeight = _a.sent();
                        console.log("latestBlockHeight =", startingBlockHeight);
                        cursors = this.eventNames.map(function (eventName) {
                            var cursor = _this.blockCursorService.findOrCreateLatestBlockCursor(startingBlockHeight, eventName);
                            return { cursor: cursor, eventName: eventName };
                        });
                        if (!cursors || !cursors.length) {
                            throw new Error("Could not get block cursor from database.");
                        }
                        cursors.forEach(function (_a) {
                            var cursor = _a.cursor, eventName = _a.eventName;
                            return __awaiter(_this, void 0, void 0, function () {
                                var blockCursor, poll;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, cursor];
                                        case 1:
                                            blockCursor = _b.sent();
                                            poll = function () { return __awaiter(_this, void 0, void 0, function () {
                                                var fromBlock, toBlock, e_1, result, decoded, e_2;
                                                var _a;
                                                var _this = this;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _b.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, this.getBlockRange(blockCursor, startingBlockHeight)];
                                                        case 1:
                                                            // Calculate block range to search
                                                            (_a = _b.sent(), fromBlock = _a.fromBlock, toBlock = _a.toBlock);
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            e_1 = _b.sent();
                                                            console.warn("Error retrieving block range:", e_1);
                                                            return [3 /*break*/, 3];
                                                        case 3:
                                                            if (!(fromBlock <= toBlock)) return [3 /*break*/, 10];
                                                            _b.label = 4;
                                                        case 4:
                                                            _b.trys.push([4, 9, , 10]);
                                                            return [4 /*yield*/, fcl.send([
                                                                    fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock),
                                                                ])];
                                                        case 5:
                                                            result = _b.sent();
                                                            return [4 /*yield*/, fcl.decode(result)];
                                                        case 6:
                                                            decoded = _b.sent();
                                                            if (!decoded.length) return [3 /*break*/, 8];
                                                            decoded.forEach(function (event) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, this.onEvent(event)];
                                                                    case 1: return [2 /*return*/, _a.sent()];
                                                                }
                                                            }); }); });
                                                            return [4 /*yield*/, this.blockCursorService.updateBlockCursorById(blockCursor.id, toBlock)];
                                                        case 7:
                                                            // Record the last block that we saw an event for
                                                            blockCursor = _b.sent();
                                                            _b.label = 8;
                                                        case 8: return [3 /*break*/, 10];
                                                        case 9:
                                                            e_2 = _b.sent();
                                                            console.error("Error retrieving events for block range fromBlock=" + fromBlock + " toBlock=" + toBlock, e_2);
                                                            return [3 /*break*/, 10];
                                                        case 10:
                                                            setTimeout(poll, this.stepTimeMs);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            poll();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseEventHandler.prototype.getBlockRange = function (blockCursor, startingBlockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var fromBlock, toBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromBlock = startingBlockHeight < blockCursor.currentBlockHeight
                            ? blockCursor.currentBlockHeight
                            : startingBlockHeight;
                        return [4 /*yield*/, this.flowService.getLatestBlockHeight()];
                    case 1:
                        toBlock = _a.sent();
                        if (!(toBlock - fromBlock > this.stepSize)) return [3 /*break*/, 3];
                        fromBlock = toBlock;
                        return [4 /*yield*/, this.flowService.getLatestBlockHeight()];
                    case 2:
                        toBlock =
                            (_a.sent()) -
                                this.latestBlockOffset;
                        _a.label = 3;
                    case 3:
                        console.log("fromBlock=" + fromBlock + " toBlock=" + toBlock + " latestBlock=" + toBlock);
                        return [2 /*return*/, Object.assign({}, { fromBlock: fromBlock, toBlock: toBlock })];
                }
            });
        });
    };
    return BaseEventHandler;
}());
exports.BaseEventHandler = BaseEventHandler;
