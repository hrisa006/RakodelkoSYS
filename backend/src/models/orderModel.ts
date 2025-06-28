import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalPrice!: number;
  public status!: OrderStatus;
    createdAt: any;
    OrderItems: any;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "Order", tableName: "Orders" }
);

export default Order;
