import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchOrder, downloadInvoice } from "../api/orders";
import type { Order } from "../types/types";
import "./OrderConfirmPage.css";

export default function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    if (id) fetchOrder(+id).then(setOrder);
  }, [id]);

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
