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
            console.log("Data från inloggning: ", data);

            if (data.user) {
                setUser(data.user);
            } else {
                console.error("Misslyckad inloggning");
                throw new Error("Det blev något fel vid inloggning");
            }

            // Fånga fel 
        } catch (error) {
            console.error("Misslyckad inloggning", error);
            throw new Error("Misslyckad inloggning");
        }
    }

    // Metod för att kontrollera om användaren är inloggad och slippa logga in på nytt vid sidomladdning
    const checkToken = async () => {

        try {
            const res = await fetch("http://localhost:5000/checkuser", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Hittade ingen session"); // Vid ev fel 

            const data = await res.json();
            setUser(data.user.user || data.user);

            // Fånga fel 
        } catch (error) {
            console.error("Något gick fel vid kontroll av session");
            setUser(null);
        }
    }

    // Anropa checkToken
    useEffect(() => {
        checkToken();
    }, []);

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