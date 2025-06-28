import "dotenv/config";
import path from "path";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import sequelize from "./src/config/database";
import authRoutes from "./src/routes/authRoutes";
import itemRoutes from "./src/routes/itemRoutes";
import cartRoutes from "./src/routes/cartRoutes";
import authenticateToken from "./src/middlewares/authToken";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", authenticateToken, (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to RakodelkoSYS API", user: req.user });
});

(async () => {
  try {
    await sequelize.sync();
    console.log("Database is synchronized");
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
  }
})();
