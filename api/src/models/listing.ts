import { BaseModel } from "./base"

class Listing extends BaseModel {
  listing_resource_id!: number;
  item_id!: number;
  item_kind!: number;
  item_rarity!: number;
  name!: string;
  image!: string;
  owner!: string;
  price!: number;
  transaction_id!: string;

  static get tableName() {
    return "listings";
  }
}

export { Listing }
