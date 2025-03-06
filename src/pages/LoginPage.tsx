import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // States 
  const [username, setUsername] = useState(""); /// Användarnamn 
  const [password, setPassword] = useState(""); // lösenord 
  const [error, setError] = useState(""); // Felmeddelanden 

  const {login, user} = useAuth();
  const navigate = useNavigate();

  // Kontrollera använddare 
  useEffect(() => {
    // Om user inte är null 
    if(user) {
      navigate("/my-account");
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // förhindra sidomladdning
    setError(""); // nollställ error-state 

    try {
      
      await login({username, password}); // Skicka med användarnamn och lösen 
      // Om ok, skicka användaren till profil-sida 
      navigate("/my-account");

      // fånga fel 
    } catch (error) {
      setError("Misslyckad inloggning, kontrollera inloggningsuppgifter")
    }
  };

  return (
    // Logga in-formulär
    <div className="login-container">
      <div className="login-box">
        <h2>Logga in</h2>

        <form className="loginForm" onSubmit={handleSubmit}>
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
          <button className="loginBtn" type="submit">Logga in</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage