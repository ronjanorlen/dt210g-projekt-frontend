import { Navigate } from "react-router-dom"; // Kunna skicka användare vidare 
import { ReactNode } from "react"; // För interfaces 
import { useAuth } from "../context/AuthContext"; // autentisering 

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Kolla om det finns en användare 
    const { user } = useAuth();
    // om det inte finns inloggad användare, ersätt nuvarande url till login, skicka till logga in-sida 
    if (!user) {
        return <Navigate to="/login" replace />
    }
    // om det finns inloggad användare, ge åtkomst till skyddad sida 
    return (
        <>{children}</>
    )
}

export default ProtectedRoute