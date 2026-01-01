import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchMyItems, createItem, removeItem } from "../../../api/items";
import { uploadImage } from "../../../api/media";
import type { Item } from "../../../types/types";
import ItemCard from "../../ItemCard";
import "../../ItemGrid.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
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
      const newItem = await createItem({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });

      if (form.images.length > 0) {
        await Promise.all(
          form.images.map((image) => uploadImage(newItem.id, image))
        );
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
      console.error("[createItem] error", err);
      alert("Грешка при създаване на изделие.");
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

  return (
    <main className="profile">
      <header className="profile__header">
        <h2 className="profile__title">Профил на {user?.username}</h2>
        <p className="profile__subtitle">Управлявай обявите си и качвай нови продукти.</p>
      </header>

      <section className="profile-card profile__upload">
        <h3>Качи ново изделие</h3>
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
            required
            ref={fileInputRef}
          />
          <div className="upload-form__actions upload-form__full">

            <button type="submit">Запази</button>

          </div>
        </form>
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
