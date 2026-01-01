import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchOrder,
  downloadInvoice,
  confirmOrderPayment,
} from "../../../api/orders";
import type { Order } from "../../../types/types";
import "./OrderConfirmPage.css";
import { useShop } from "../../../contexts/ShopContext";

export default function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order>();
  const { clearCart } = useShop();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!id) return;
    const load = async () => {
      try {
        if (sessionId) {
          const confirmed = await confirmOrderPayment(+id, sessionId);
          setOrder(confirmed);
          await clearCart();
          return;
        }
        const data = await fetchOrder(+id);
        setOrder(data);
      } catch (err) {
        console.error("[orderConfirm] error", err);
        if (sessionId) {
          alert("Плащането не е потвърдено.");
        }
        try {
          const data = await fetchOrder(+id);
          setOrder(data);
        } catch (error) {
          console.error("[orderConfirm] fallback error", error);
        }
      }
    };
    load();
  }, [id, searchParams]);

  if (!order) return <p>Зареждане…</p>;

  return (
    <main className="order-confirm">
      <h2>Поръчка №{order.id} – успешно създадена!</h2>
      <p>
        Обща стойност: <strong>{order.totalPrice} лв.</strong>
      </p>

      <button className="btn-invoice" onClick={() => downloadInvoice(order.id)}>
        💾 Изтегли фактура (PDF)
      </button>

      <p className="small">
        Ще получите имейл, щом пратката бъде изпратена. Благодарим Ви! ❤️
      </p>
    </main>
  );
}
