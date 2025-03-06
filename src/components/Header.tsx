import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Header = () => {

  const { user, logout } = useAuth(); // Hämta användare 

  return (
    <header>
      <nav>
        <ul>
          <li><NavLink to="/">Start</NavLink></li>
          <li><NavLink to="/my-account">Min profil</NavLink></li>
          <li><NavLink to="/create-account">Skapa konto</NavLink></li>

          <li>
            {
              !user ? <NavLink to="/login">Logga in</NavLink> : <button onClick={logout}>Logga ut</button>
            }

          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header