import { Link } from "react-router-dom";
import ItemCard from "./ItemCard";
import { useState, useEffect } from "react";
import { fetchNewItems } from "../api/items";
import type { Item } from "../types/types";
import "./Home.css";
import "./ItemsPage.css";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNewItems();
        setItems(data);
      } catch (err) {
        console.error("Error fetching new items:", err);
      }
    };
    load();
  }, []);

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__overlay" />
        <div className="home__hero-content">
          <h1 className="home__title">
            Ръкоделко – Пазар за уникални ръкоделия
          </h1>
          <p className="home__subtitle">
            Открий ръчно изработени продукти, направени с любов от майстори в
            цяла България.
          </p>
          <Link to="/register" className="btn btn--primary">
            Регистрирай се
          </Link>
        </div>
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2>Ново в магазина</h2>
          <Link to="/new" className="link--more">
            Виж всички &raquo;
          </Link>
        </div>
        <div className="item-grid">
          {items.slice(0, 5).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="home__section home__section--accent">
        <div className="home__section-header">
          <h2>Разпродажба</h2>
          <Link to="/sale" className="link--more--light">
            Виж всички &raquo;
          </Link>
        </div>
        <div className="item-grid">
          {/* TODO: Fetch items on sale */}
          <div className="item-card placeholder" />
          <div className="item-card placeholder" />
          <div className="item-card placeholder" />
        </div>
      </section>

      <section className="home__about">
        <h2>За Ръкоделко</h2>
        <p>
          Ръкоделко е общност за ценители на ръчно изработеното. Нашата мисия е
          да подкрепяме творците и да свързваме техните произведения със света.
        </p>
        <Link to="/about" className="btn btn--secondary">
          Научи повече
        </Link>
      </section>

      <section className="home__newsletter">
        <div className="newsletter__left">
          <h3>Запишете се за нашия бюлетин!</h3>
          <form
            className="newsletter__form"
            onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Въведете своя имейл..." required />
            <button type="submit">Запиши</button>
          </form>
        </div>

        <div className="newsletter__right">
          <h3>Последвайте ни на</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-facebook-square" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-pinterest" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
