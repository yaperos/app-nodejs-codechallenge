import { Model } from "objection";

class BaseModel extends Model {
  createdAt!: Date;
  updatedAt!: Date;

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }
}

export default BaseModel;