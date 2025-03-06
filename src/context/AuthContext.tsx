import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types";

// Skapa context 
const AuthContext = createContext<AuthContextType | null>(null);
// Vad ska skickas ut till komponent som använder provider 
interface AuthProviderProps {
    children: ReactNode
}

// Skapa provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null); // State för användare

    // Logga in användare 
    const login = async (credentials: LoginCredentials) => {

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: "include" // skicka med cookie 
            })

            // Om knas
            if (!res.ok) throw new Error("Inloggning misslyckades");

            // Om korrekt 
            const data = await res.json() as AuthResponse;
            // Använd data, får med användare och token 
          // localStorage.setItem("token", data.token); // spara i localstorage (sätt till userId istället?) 
            
          console.log("före setUser", data.user); // testlogg, ta bort sen 

          setUser(data.user);
        console.log("efter setUser", data); // ta bort 

          //  await checkToken();

            // Fånga fel 
        } catch (error) {
            throw error;
        }
    }

    // Metod för att kontrollera om användaren är inloggad och slippa logga in på nytt vid sidomladdning
    const checkToken = async () => {
      //  const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/checkuser", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                  //  "Authorization": "Bearer " + token
                }
            });

         //  console.log("Server-response: ", res);

         if (res.status === 401) {
            console.warn("Ingen giltig session hittad");
            setUser(null);
            return;
         }

            if (!res.ok) throw new Error("Hittade ingen session"); // Vid ev fel 

            const data = await res.json();
       //    console.log("Hämtad användare: ", data); // Ta bort sen
         setUser(data.user);

            // Fånga fel 
        } catch (error) {
            console.error("Något gick fel vid kontroll av session");
         //   localStorage.removeItem("token");
            setUser(null);
        }
    }

    // Anropa checkToken
    useEffect(() => {
        checkToken();
    }, [])

    // Logga ut användare 
    const logout = async () => {
        try {
            const res = await fetch("http://localhost:5000/logout", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            // Vid fel 
            if (!res.ok) throw new Error("Misslyckad utloggning");

            // Annars töm localstorage och användare 
          //  localStorage.removeItem("token");
            setUser(null);

        } catch (error) {
            console.error("Fel vid utloggning: ", error);
        }

    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    // Kontroll om context inte finns 
    if (!context) {
        throw new Error("useAuth måste användas inom en authProvider");
    }
    // Annars returnera context
    return context;

}