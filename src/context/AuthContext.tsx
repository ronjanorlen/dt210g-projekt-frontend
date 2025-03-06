import { createContext, useState, useContext, ReactNode } from "react";
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
                body: JSON.stringify(credentials)
            })

            // Om knas
            if (!res.ok) throw new Error("Inloggning misslyckades");

            // Om korrekt 
            const data = await res.json() as AuthResponse;
            // Använd data, får med användare och token 
            localStorage.setItem("token", data.token); // spara i localstorage 
            setUser(data.user);

            // Fånga fel 
        } catch (error) {
            throw error;
        }
    }

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
            localStorage.removeItem("token");
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