"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOffer = void 0;
const base_1 = require("./base");
class SaleOffer extends base_1.BaseModel {
    static get tableName() {
        return "sale_offers";
    }
}
exports.SaleOffer = SaleOffer;
