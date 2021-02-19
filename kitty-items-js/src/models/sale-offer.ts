import { BaseModel } from "./base";

class SaleOffer extends BaseModel {
  id!: string;
  price!: st;
  current_block_height!: number;

  static get tableName() {
    return "block_cursor";
  }
}

export { SaleOffer };
