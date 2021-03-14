import { BaseModel } from "./base";

class KittyItem extends BaseModel {
  id!: number;
  type_id?: number;
  owner_address?: string;

  static get tableName() {
    return "kitty_items";
  }
}

export { KittyItem };
