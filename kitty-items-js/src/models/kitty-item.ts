import { BaseModel } from "./base";
import { SaleOffer } from "./sale-offer";

class KittyItem extends BaseModel {
  id!: number;
  type_id!: number;

  saleOffers?: SaleOffer[];

  static get tableName() {
    return "kitty_items";
  }

  static relationMappings = {
    kitty_item: {
      relation: BaseModel.HasManyRelation,
      modelClass: SaleOffer,
      join: {
        from: "kitty_items.id",
        to: "sale_offers.kitty_item_id",
      },
    },
  };
}

export { KittyItem };
