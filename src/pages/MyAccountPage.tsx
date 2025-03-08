import { useAuth } from "../context/AuthContext"
import { BookInterface } from "../types/BookInterface";
import MyReviews from "../components/MyReviews";

const MyAccountPage = () => {

  const {user} = useAuth();

  return (
     // Inloggad användares profilsida, se och hantera alla sina recensioner 
    <div>
      <h1>Min profil</h1>
      <h2>Hej {user ? user.username : ""}!</h2>
      <MyReviews />
    </div>
    
   

  )
}

export default MyAccountPage