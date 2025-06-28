import { DataTypes, InferAttributes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

interface ReviewAttributes {
  id: number;
  userId: number;
  itemId: number;
  rating: RatingValue;
  comment: string;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, "id" | "comment">;

class Review
  extends Model<InferAttributes<Review>, ReviewCreationAttributes>
  implements ReviewAttributes
{
  declare id: number;
  declare userId: number;
  declare itemId: number;
  declare rating: RatingValue;
  declare comment: string;
}

Review.init(
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
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Reviews",
    timestamps: true,
  }
);

export default Review;
