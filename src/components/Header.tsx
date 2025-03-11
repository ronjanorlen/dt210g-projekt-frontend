import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./css/Header.css"
import logotyp from "../assets/img/logotyp.jpg"

const Header = () => {

  const { user, logout } = useAuth(); // Hämta användare 

  return (
    <header>
      <nav>
        <div className="logo-container">
          <NavLink to="/">
            <img src={logotyp} alt="Tre böcker staplade på hög" className="logo" />
          </NavLink>
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}><i className="fa-solid fa-house"></i> Hem</NavLink></li>
          <li><NavLink to="/my-account" className={({ isActive }) => isActive ? "active" : ""}><i className="fa-solid fa-user"></i> Mina sidor</NavLink></li>
          <li><NavLink to="/create-account" className={({ isActive }) => isActive ? "active" : ""}><i className="fa-solid fa-user-plus"></i> Skapa konto</NavLink></li>


          <li className="user-auth">
            {
              !user ? <NavLink to="/login"><i className="fa-solid fa-arrow-right-to-bracket"></i> Logga in</NavLink> : <button onClick={logout}><i className="fa-solid fa-arrow-left"></i> Logga ut</button>
            }
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header