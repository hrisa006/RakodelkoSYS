import User from "./userModel";
import Item from "./itemModel";
import Order from "./orderModel";
import OrderItem from "./orderItemModel";
import CartItem from "./cartItemModel";
import Review from "./reviewModel";
import Shipping from "./shippingModel";
import Media from "./mediaModel";

// User ↔ CartItems
User.hasMany(CartItem, { foreignKey: "userId" });
CartItem.belongsTo(User, { foreignKey: "userId" });

// User ↔ Orders
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// User ↔ Review
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

// User ↔ Item
User.hasMany(Item, { foreignKey: "sellerId", as: "items" });
Item.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// Item ↔ Media
Item.hasMany(Media, { foreignKey: "itemId", onDelete: "CASCADE" });
Media.belongsTo(Item, { foreignKey: "itemId" });

// Item ↔ CartItems
Item.hasMany(CartItem, { foreignKey: "itemId" });
CartItem.belongsTo(Item, { foreignKey: "itemId" });

// Item ↔ OrderItems
Item.hasMany(OrderItem, { foreignKey: "itemId" });
OrderItem.belongsTo(Item, { foreignKey: "itemId" });

// Item ↔ Review
Item.hasMany(Review, { foreignKey: "itemId", onDelete: "CASCADE" });
Review.belongsTo(Item, { foreignKey: "itemId" });

// Order ↔ OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Order ↔ Shipping
Order.hasOne(Shipping, { foreignKey: "orderId", onDelete: "CASCADE" });
Shipping.belongsTo(Order, { foreignKey: "orderId" });
