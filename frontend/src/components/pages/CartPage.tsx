import { useShop } from "../../contexts/ShopContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./CartPage.css";
import { useAuth } from "../../contexts/AuthContext";

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cart, isLoadingCart, updateCartQty, removeFromCart, checkout } =
    useShop();

  const total = cart.reduce((sum, ci) => {
    if (!ci.item) return sum;
    return sum + ci.item.price * ci.quantity;
  }, 0);

  if (isLoadingCart) return <p>Зареждане…</p>;
  if (cart.length === 0) {
    return <p className="cart-empty">Количката е празна.</p>;
  }

  const handleCheckout = async () => {
    if (!user) {
      alert("Моля влезте в профила си, за да завършите поръчката си.");
      navigate("/login", { state: { redirectTo: location.pathname } });
      return;
    }
    try {
      const order = await checkout();
      console.log("ORDER:", order);
      navigate(`/orders/${order.id}/confirm`);
    } catch (e) {
      alert("Грешка при създаване на поръчка.");
      console.error(e);
    }
  };

  return (
    <main className="cart">
      <h2>Количка</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Продукт</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Общо</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((ci) => {
            if (!ci.item) return null;
            return (
              <tr key={ci.id}>
                <td>
                  <Link to={`/items/${ci.item.id}`}>{ci.item.title}</Link>
                </td>
                <td>{ci.item.price} лв.</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={ci.quantity}
                    onChange={(e) => updateCartQty(ci.id, +e.target.value)}
                  />
                </td>
                <td>{(ci.quantity * ci.item.price).toFixed(2)} лв.</td>
                <td>
                  <button onClick={() => removeFromCart(ci.id)}>✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cart-total">
        <div className="cart-total-info">
          Общо: <strong>{total.toFixed(2)} лв.</strong>
        </div>
        <button onClick={handleCheckout} className="btn-checkout">
          Към поръчка
        </button>
      </div>
    </main>
  );
};
export default CartPage;
