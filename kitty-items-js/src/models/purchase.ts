import { BaseModel } from "./base";
import { KittyItem } from "./kitty-item";
import { SaleOffer } from "./sale-offer";

class Purchase extends BaseModel {
  id!: number;
  buyer_address!: string;
  tx_hash!: string;

  saleOffer?: SaleOffer;

  static relationMappings = {
    kitty_item: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: SaleOffer,
      join: {
        from: "purchase.id",
        to: "sale_offers.id",
      },
    },
  };
}
