import React, { useEffect } from "react";
import { useShop } from "../../contexts/ShopContext";
import ItemCard from "../ItemCard";
import "./ItemsPage.css";

const ItemsPage: React.FC = () => {
  const { items, fetchItems, isLoadingItems } = useShop();

  useEffect(() => {
    if (items.length === 0) fetchItems();
  }, [fetchItems, items.length]);

  if (isLoadingItems) return <p style={{ textAlign: "center" }}>Зареждане…</p>;

  return (
    <section className="items-page">
      <h2 className="page-title">Всички изделия</h2>

      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>Няма налични изделия.</p>
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
