"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCursor = void 0;
var base_1 = require("./base");
var BlockCursor = /** @class */ (function (_super) {
    __extends(BlockCursor, _super);
    function BlockCursor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BlockCursor, "tableName", {
        get: function () {
            return "block_cursor";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlockCursor.prototype, "currentBlockHeight", {
        get: function () {
            return Number(this.current_block_height);
        },
        enumerable: false,
        configurable: true
    });
    return BlockCursor;
}(base_1.BaseModel));
exports.BlockCursor = BlockCursor;
