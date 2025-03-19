import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/LoginPage.css";

const LoginPage = () => {
  // States 
  const [username, setUsername] = useState(""); /// Användarnamn 
  const [password, setPassword] = useState(""); // lösenord 
  const [error, setError] = useState(""); // Felmeddelanden 
  const [loading, setLoading] = useState(false); // Laddning 

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Kontrollera använddare 
  useEffect(() => {
    // Om user inte är null 
    if (user) {
      navigate("/my-account");
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // förhindra sidomladdning
    setError(""); // nollställ error-state 

    try {
      setLoading(true); 

      await login({ username, password }); // Skicka med användarnamn och lösen 
      // Om ok, skicka användaren till profil-sida 
      navigate("/my-account");

      // fånga fel 
    } catch (error) {
      setError("Misslyckad inloggning, kontrollera inloggningsuppgifter")
    } finally {
      setLoading(false);
    }
  };

  return (
    // Logga in-formulär
    <div className="login-container">
      <div className="login-box">
        <h2>Ange dina inloggningsuppgifter</h2>

        <form className="loginForm" onSubmit={handleSubmit}>

        {loading && <div className="loader"></div>}

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="loginBtn" type="submit"><i className="fa-solid fa-arrow-right"></i> Logga in</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage