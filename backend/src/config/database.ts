import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error(
    "Missing one or more required environment variables: " +
      "DB_NAME, DB_USER, DB_PASSWORD, DB_HOST"
  );
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  logging: false, // Изключва конзолното „спамене“ – махни, ако ти трябва дебъг
});

export default sequelize;
