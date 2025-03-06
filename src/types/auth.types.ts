// Interface för användare 
export interface User {
   _id: string,
    id?: string, 
    username: string,
    password: string
}

// Uppgifter som skickas till backend
export interface LoginCredentials {
    username: string,
    password: string
}

// interface för uppgifter vi får från backend 
export interface AuthResponse {
    user: User, // Får tillbaka användare
    token: string // får tillbaka token 
}

// Definiera context-fil - vad den innehåller 
export interface AuthContextType {
    user: User | null, // Antingen en användare med props eller null 
    // Metod för inloggning
    login: (credentials: LoginCredentials) => Promise<void>;
    // Metod för utloggning
    logout: () => void;
}