import { BaseModel } from "./base";
import { KittyItem } from "./kitty-item";
import { SaleOffer } from "./sale-offer";

class Purchase extends BaseModel {
  id!: string;
  buyer_address!: string;
  tx_hash!: string;

  saleOffer?: SaleOffer;
  nft?: KittyItem;

  static get tableName() {
    return "purchases";
  }

  static relationMappings = {
    sale_offer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: SaleOffer,
      join: {
        from: "purchases.sale_offer_id",
        to: "sale_offers.id",
      },
    },
    kitty_item: {
      relation: BaseModel.HasOneRelation,
      modelClass: KittyItem,
      join: {
        from: "purchases.kitty_item_id",
        to: "kitty_items.id",
      },
    },
  };
}
