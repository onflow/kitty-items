import { BaseModel } from "./base";
import { KittyItem } from "./kitty-item";

class SaleOffer extends BaseModel {
  id!: string;
  price!: number;
  seller_address!: string;
  is_complete!: boolean;
  tx_hash!: string;

  kittyItem?: KittyItem;

  static get tableName() {
    return "sale_offers";
  }

  static relationMappings = {
    kitty_item: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: KittyItem,
      join: {
        from: "sale_offers.kitty_item_id",
        to: "kitty_items.id",
      },
    },
  };
}

export { SaleOffer };
