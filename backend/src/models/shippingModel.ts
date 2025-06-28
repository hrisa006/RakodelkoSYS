import { DataTypes, InferAttributes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type ShippingStatus = "pending" | "shipped" | "delivered";

interface ShippingAttrs {
  id: number;
  orderId: number;
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  status: ShippingStatus;
}

type ShippingCreation = Optional<ShippingAttrs, "id" | "status">;

class Shipping
  extends Model<InferAttributes<Shipping>, ShippingCreation>
  implements ShippingAttrs
{
  declare id: number;
  declare orderId: number;
  declare recipientName: string;
  declare addressLine1: string;
  declare addressLine2?: string;
  declare city: string;
  declare postalCode: string;
  declare country: string;
  declare status: ShippingStatus;
}

Shipping.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    recipientName: { type: DataTypes.STRING(120), allowNull: false },
    addressLine1: { type: DataTypes.STRING(200), allowNull: false },
    addressLine2: { type: DataTypes.STRING(200) },
    city: { type: DataTypes.STRING(80), allowNull: false },
    postalCode: { type: DataTypes.STRING(20), allowNull: false },
    country: { type: DataTypes.STRING(80), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "Shipping", tableName: "Shippings" }
);

export default Shipping;
