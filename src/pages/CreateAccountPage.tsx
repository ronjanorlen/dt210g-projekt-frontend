import * as Yup from "yup";
import { useState } from "react";
import { NewAccountInterface } from "../types/NewAccountInterface";
import { useNavigate } from "react-router-dom";

const CreateAccountPage = () => {

  // States 
  const [username, setUsername] = useState(""); // användarnamn
  const [password, setPassword] = useState(""); // lösenord 
  const [errors, setErrors] = useState<NewAccountInterface>({}); // interface för ny användare 
  const navigate = useNavigate(); // navigering 

  // Valideringsschema med yup 
  const validationSchema = Yup.object({
    username: Yup.string().min(3, "Användarnamnet måste vara minst 3 tecken").max(30, "Användarnamnet får vara max 30 tecken").required("Användarnamn är obligatoriskt"),
    password: Yup.string().min(5, "Lösenordet måste vara minst 5 tecken").max(30, "Lösenordet kan vara max 30 tecken").required("Lösenord är obligatoriskt")
  });

  // Skapa nytt användarkonto 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Förhindra sidomladdning 
    const user = { username, password };

    try {
      // Validering 
      await validationSchema.validate(user, { abortEarly: false });

      // Rensa ev fel 
      setErrors({});

      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
        "credentials": "include"
      });

      const data = await res.json();

      // Om ej ok 
      if (!res.ok) {
        if (data.message === "Användarnamnet är upptaget, välj något annat") {
          setErrors({ username: data.message });
          return;
        }
        throw new Error(data.message || "Något gick fel vid registrering");
      }

      // om ok 
      alert("Ditt konto har skapats!");

      // Rensa formulär 
      setUsername("");
      setPassword("");

      // Skicka vidare till logga in-sidan 
      navigate("/login");

      // Fånga fel 
    } catch (error) {
      const validationErrors: NewAccountInterface = {};

      // Loopa igenom valideringsfel från yup 
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((error) => {
          const prop = error.path as keyof NewAccountInterface;
          validationErrors[prop] = error.message;
        });

        setErrors(validationErrors); // Sätt valideringsfel 
      }
    }
  }


  return (

    // Skapa konto-formulär
    <div className="login-container">
      <div className="login-box">
        <h2>Skapa konto</h2>
        <p>Ange det användarnamn du vill ha samt ett lösenord du kommer ihåg</p>

        <form className="loginForm" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {errors.username && <p className="error-msg">{errors.username}</p>}
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

            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>
          <button className="loginBtn" type="submit"><i className="fa-solid fa-user-plus"></i> Skapa konto</button>
        </form>
      </div>
    </div>
  )
}

export default CreateAccountPage