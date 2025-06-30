import { useEffect, useState } from "react";
import { fetchNewItems } from "../api/items";
import type { Item } from "../types/types";
import ItemCard from "./ItemCard";
import "./ItemsPage.css";

const NewItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNewItems();
        setItems(data);
      } catch (err) {
        console.error("Error fetching new items:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="items-page">
      <h2 className="page-title">Най-новите изделия</h2>
      {loading ? (
        <p>Зареждане...</p>
      ) : items.length === 0 ? (
        <p>Няма нови изделия</p>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewItemsPage;
