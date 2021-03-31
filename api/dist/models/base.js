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
exports.BaseModel = void 0;
var objection_1 = require("objection");
var BaseModel = /** @class */ (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseModel.prototype.$beforeInsert = function () {
        this.created_at = new Date();
    };
    BaseModel.prototype.$beforeUpdate = function () {
        this.updated_at = new Date();
    };
    return BaseModel;
}(objection_1.Model));
exports.BaseModel = BaseModel;
