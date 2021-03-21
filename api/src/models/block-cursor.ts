import { BaseModel } from "./base";

class BlockCursor extends BaseModel {
  id!: string;
  cursor_label!: string;
  current_block_height!: number;

  static get tableName() {
    return "block_cursor";
  }
}

export { BlockCursor };
