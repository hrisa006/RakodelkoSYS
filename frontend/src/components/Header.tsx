import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo-white.png";
import { IoSearch } from "react-icons/io5";
import { IoPersonSharp, IoCart } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
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
          <img className="header-logo" src={logo} alt="Rakodelko logo" />
          <div className="header-search">
            <input type="text" placeholder="Търсене…" />
            <IoSearch
              style={{ color: "var(--color-white)", fontSize: "18px" }}
            />
          </div>
          <div className="header-icons">
            <button
              onClick={handleProfileClick}
              title={user ? "Профил" : "Вход"}>
              <IoPersonSharp />
            </button>

            
            <button onClick={() => navigate("/cart")} title="Количка">
              <IoCart className="icon-cart" style={{ fontSize: "30px" }} />
            </button>

          
            {user && (
              <button onClick={handleLogout} className="btn-logout">
                Изход
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
          <li>
            <NavLink to="/creators">За създатели</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
