import React, { useEffect } from "react";
import { useShop } from "../../contexts/ShopContext";
import ItemCard from "../ItemCard";
import "../ItemGrid.css";
import "./ItemsPage.css";

const ItemsPage: React.FC = () => {
  const { items, fetchItems, isLoadingItems } = useShop();

  useEffect(() => {
    if (items.length === 0) fetchItems();
  }, [fetchItems, items.length]);

  if (isLoadingItems) return <p className="cart-empty">Зареждане…</p>;

  return (
    <section className="items-page" >
      <h2 className="page-title">Всички изделия</h2>

      {items.length === 0 ? (
        <p className="cart-empty">Няма налични изделия.</p>
      ) : (
        <div className="items-grid">
          {items.map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ItemsPage;
