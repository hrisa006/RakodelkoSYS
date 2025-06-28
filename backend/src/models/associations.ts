import User from "./userModel";
import Item from "./itemModel";
import Order from "./orderModel";
import OrderItem from "./orderItemModel";
import CartItem from "./cartItemModel";

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
