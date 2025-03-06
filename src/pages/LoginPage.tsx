import { useState } from "react"

const LoginPage = () => {
  // States 
  const [username, setUsername] = useState(""); /// Användarnamn 
  const [password, setPassword] = useState(""); // lösenord 
  const [error, setError] = useState(""); // Felmeddelanden 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // förhindra sidomladdning
    setError(""); // nollställ error-state 
  };

  return (
    // Logga in-formulär
    <div className="login-container">
      <div className="login-box">
        <h2><i className="fa-solid fa-user"></i> Logga in</h2>

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