import { BaseModel } from "./base";

class SaleOffer extends BaseModel {
  saleItemId!: number;
  saleItemType!: number;
  saleItemCollection!: string;
  transactionId!: string;
  price!: number;

  static get tableName() {
    return "sale_offers";
  }
}

export { SaleOffer };
