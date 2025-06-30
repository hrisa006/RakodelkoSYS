import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo-white.png";
// import { IoSearch } from "react-icons/io5";
import { IoPersonSharp, IoCart } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";
import { useShop } from "../contexts/ShopContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useShop();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <div className="header-banner">
        <div className="header-inner">
          <a href="/">
            <img className="header-logo" src={logo} alt="Rakodelko logo" />
          </a>
          {/* <div className="header-search">
            <input type="text" placeholder="Търсене…" />
            <IoSearch
              style={{ color: "var(--color-white)", fontSize: "18px" }}
            />
          </div> */}
          <div className="header-icons">
            <button
              onClick={handleProfileClick}
              title={user ? "Профил" : "Вход"}>
              <IoPersonSharp />
            </button>

            <button onClick={() => navigate("/cart")} title="Количка">
              <IoCart className="icon-cart" style={{ fontSize: "30px" }} />
              {cart.length > 0 && <span className="badge">{cart.length}</span>}
            </button>

            {user && (
              <button onClick={handleLogout} className="btn-logout">
                <HiOutlineLogout />
              </button>
            )}
          </div>
        </div>
      </div>
      <nav className="main-nav">
        <ul>
          <li>
            <NavLink to="/">Начало</NavLink>
          </li>
          <li>
            <NavLink to="/new">Ново</NavLink>
          </li>
          <li>
            <NavLink to="/items">Изделия</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
