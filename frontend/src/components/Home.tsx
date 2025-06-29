import { Link } from "react-router-dom";
// import "./Home.css";

export default function Home() {
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

      {/* ───── New In Section ───── */}
      <section className="home__section">
        <div className="home__section-header">
          <h2>Ново в магазина</h2>
          <Link to="/new" className="link--more">
            Виж всички &raquo;
          </Link>
        </div>
        <div className="item-grid">
          {/* TODO: Fetch latest items and map to <ItemCard /> */}
          <div className="item-card placeholder" />
          <div className="item-card placeholder" />
          <div className="item-card placeholder" />
        </div>
      </section>

      {/* ───── Sale Section ───── */}
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

      {/* ───── About Section ───── */}
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
    </main>
  );
}
