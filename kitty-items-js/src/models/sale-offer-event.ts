import { BaseModel } from "./base";

class SaleOfferEvent extends BaseModel {
  id!: number;
  event!: JSON;

  static get tableName() {
    return "sale_offer_events";
  }
}

export { SaleOfferEvent };
