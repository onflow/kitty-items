import { BaseModel } from "./base";

class SaleOffer extends BaseModel {
  saleItemID!: number;
  saleItemType!: number;
  saleItemCollection!: string;
  price!: number;

  static get tableName() {
    return "sale_offers";
  }
}

export { SaleOffer };
