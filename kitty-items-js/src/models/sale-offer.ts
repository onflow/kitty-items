import { BaseModel } from "./base";
import { KittyItem } from "./kitty-item";

class SaleOffer extends BaseModel {
  id!: number;
  price!: number;
  flowAddress!: string

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
