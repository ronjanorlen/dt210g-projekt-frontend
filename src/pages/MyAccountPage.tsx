import { useAuth } from "../context/AuthContext"

const MyAccountPage = () => {

  const {user} = useAuth();

  return (
     // Inloggad användares profilsida, se och hantera alla sina recensioner 
    <div>
      <h1>Min profil</h1>
      <h2>Hej {user ? user.username : ""}</h2>
    </div>
    
   

  )
}

export default MyAccountPage