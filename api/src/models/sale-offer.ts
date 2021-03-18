import { BaseModel } from "./base";

class SaleOffer extends BaseModel {
  sale_item_id!: number;
  sale_item_type!: number;
  sale_item_collection!: string;
  transaction_id!: string;
  price!: number;

  static get tableName() {
    return "sale_offers";
  }
}

export { SaleOffer };
