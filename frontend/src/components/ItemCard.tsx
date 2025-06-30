import React from "react";
import type { Item } from "../types/types";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
  <Link to={`/items/${item.id}`} className="item-card">
    <img src={`${API_URL}${item.imageUrl}`} alt={item.title} />
    <div className="body">
      <h4 className="title">{item.title}</h4>
      <p className="price">{item.price} лв.</p>
      {item.seller?.username && (
        <p className="seller">{item.seller.username}</p>
      )}
    </div>
  </Link>
);

export default ItemCard;
