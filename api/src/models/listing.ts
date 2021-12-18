import { BaseModel } from "./base"

class Listing extends BaseModel {
  listing_id!: number;
  item_id!: number;
  item_type!: number;
  item_rarity!: number;
  owner!: string;
  price!: number;
  transaction_id!: string;

  static get tableName() {
    return "listings";
  }
}

export { Listing }
