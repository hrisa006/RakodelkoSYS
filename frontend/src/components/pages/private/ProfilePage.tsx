import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useShop } from "../../../contexts/ShopContext";
import {
  fetchMyItems,
  createItem,
  removeItem,
  updateItem,
} from "../../../api/items";
import { uploadImage } from "../../../api/media";
import type { Item } from "../../../types/types";
import ItemCard from "../../ItemCard";
import "../../ItemGrid.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const { orders, isLoadingOrders, items: shopItems } = useShop();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "1",
    images: [] as File[],
  });

  const loadItems = async () => {
    const data = await fetchMyItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm({ ...form, images: files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };

      if (editingItemId) {
        await updateItem(editingItemId, payload);
        if (form.images.length > 0) {
          await Promise.all(
            form.images.map((image) => uploadImage(editingItemId, image))
          );
        }
        setEditingItemId(null);
      } else {
        const newItem = await createItem(payload);
        if (form.images.length > 0) {
          await Promise.all(
            form.images.map((image) => uploadImage(newItem.id, image))
          );
        }
      }

      await loadItems();
      setForm({
        title: "",
        description: "",
        price: "",
        quantity: "1",
        images: [],
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("[saveItem] error", err);
      alert("Грешка при запазване на продукта.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете това изделие?")) return;

    try {
      await removeItem(id);
      setItems((curr) => curr.filter((i) => i.id !== id));
    } catch (err) {
      console.error("[deleteItem] error", err);
      alert("Грешка при изтриване.");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItemId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      images: [],
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      quantity: "1",
      images: [],
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);



  return (
    <main className="profile">
      <header className="profile__header">
        <h2 className="profile__title">Профил на {user?.username}</h2>
        <p className="profile__subtitle">Управлявай обявите си и качвай нови продукти.</p>
      </header>

      <section className="profile-card profile__upload">
        <h3>{editingItemId ? "Редактирай продукт" : "Качи нов продукт"}</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            name="title"
            placeholder="Заглавие"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={form.description}
            onChange={handleChange}
            required
            className="upload-form__full"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Цена"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="quantity"
            type="number"
            min="1"
            placeholder="Количество"
            value={form.quantity}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFile}
            className="upload-form__full"
            required={!editingItemId}
            ref={fileInputRef}
          />
          <div className="upload-form__actions upload-form__full">
            {editingItemId && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>Откажи</button>
            )}
            <button type="submit">{editingItemId ? "Запази" : "Качи"}</button>
          </div>
        </form>
      </section>

      <section className="profile-card profile__orders">
        <h3>Последни поръчки</h3>
        {isLoadingOrders ? (
          <p>Зареждане...</p>
        ) : recentOrders.length === 0 ? (
          <p>Нямате поръчки.</p>
        ) : (
          <div className="orders-list">
            {recentOrders.map((order) => {
              const orderItems = order.OrderItems ?? [];
              const itemCount = orderItems.reduce(
                (sum, oi) => sum + oi.quantity,
                0
              );
              const dateLabel = new Date(order.createdAt).toLocaleDateString(
                "bg-BG"
              );
              const totalLabel = Number(order.totalPrice || 0).toFixed(2);
              const previewItems = orderItems.slice(0, 3);
              const remainingCount = orderItems.length - previewItems.length;
              return (
                <div key={order.id} className="orders-item">
                  <div className="orders-item__main">
                    <Link
                      to={`/orders/${order.id}/confirm`}
                      className="orders-item__id">
                      Поръчка #{order.id}
                    </Link>
                    <div className="orders-item__meta">
                      <span>Дата: {dateLabel}</span>
                      <span>Артикули: {itemCount}</span>
                      <span>Статус: {order.status}</span>
                    </div>
                    <div className="orders-item__products">
                      {previewItems.map((oi) => {
                        const product = shopItems.find(
                          (item) => item.id === oi.itemId
                        );
                        const title = product?.title || `Продукт #${oi.itemId}`;
                        return (
                          <Link
                            key={`${order.id}-${oi.itemId}`}
                            to={`/items/${oi.itemId}`}
                            className="orders-item__link">
                            {title}
                          </Link>
                        );
                      })}
                      {remainingCount > 0 && (
                        <span className="orders-item__more">
                          + още {remainingCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="orders-item__summary">
                    <div className="orders-item__total">{totalLabel} лв.</div>
                    <Link
                      to={`/orders/${order.id}/confirm`}
                      className="orders-item__details">
                      Детайли
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="profile-card profile__items">
        <h3>Моите изделия</h3>
        {loading ? (
          <p>Зареждане…</p>
        ) : items.length === 0 ? (
          <p>Нямаш качени изделия.</p>
        ) : (
          <div className="item-grid">
            {items.map((it) => (
              <div className="item-card-wrapper" key={it.id}>
                <ItemCard item={it} />
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(it)}
                  title="Редактирай продукт">
                  ✎
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(it.id)}
                  title="Изтрий изделието">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
