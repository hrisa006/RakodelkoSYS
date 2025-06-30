import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id?: number;
  declare title: string;
  declare description: string;
  declare price: number;
  declare quantity: number;
  declare imageUrl?: string;
  declare sellerId: number;
  declare seller?: User;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Item",
    tableName: "Items",
    timestamps: true,
  }
);

export default Item;
