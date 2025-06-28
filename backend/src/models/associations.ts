import User from "./userModel";
import Item from "./itemModel";
import Order from "./orderModel";
import OrderItem from "./orderItemModel";
import CartItem from "./cartItemModel";
import Review from "./reviewModel";
import Shipping from "./shippingModel";
import Media from "./mediaModel";

// User ↔ Orders
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Order ↔ OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Item ↔ OrderItems
Item.hasMany(OrderItem, { foreignKey: "itemId" });
OrderItem.belongsTo(Item, { foreignKey: "itemId" });

// Item ↔ CartItems
Item.hasMany(CartItem, { foreignKey: "itemId" });
CartItem.belongsTo(Item, { foreignKey: "itemId" });

// User ↔ CartItems
User.hasMany(CartItem, { foreignKey: "userId" });
CartItem.belongsTo(User, { foreignKey: "userId" });

// User ↔ Review
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

// Item ↔ Review
Item.hasMany(Review, { foreignKey: "itemId", onDelete: "CASCADE" });
Review.belongsTo(Item, { foreignKey: "itemId" });

// Order ↔ Shipping
Order.hasOne(Shipping, { foreignKey: "orderId", onDelete: "CASCADE" });
Shipping.belongsTo(Order, { foreignKey: "orderId" });

// Item ↔ Media
Item.hasMany(Media, { foreignKey: "itemId", onDelete: "CASCADE" });
Media.belongsTo(Item, { foreignKey: "itemId" });