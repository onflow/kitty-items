import { Model } from "objection";

abstract class BaseModel extends Model {
  updated_at!: Date;
  created_at!: Date;

  $beforeInsert() {
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}

export { BaseModel };
