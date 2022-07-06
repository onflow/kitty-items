import { BaseModel } from "./base";

class BlockCursor extends BaseModel {
  id!: string;
  current_block_height!: number;

  static get tableName() {
    return "block_cursor";
  }

  get currentBlockHeight(): number {
    return Number(this.current_block_height)
  }
}

export { BlockCursor };
