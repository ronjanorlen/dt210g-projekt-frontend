import ReviewForm from "../components/ReviewForm"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react";


const CreateReviewPage = () => {

    const { user } = useAuth(); // hämta användare 
    const [loading, setLoading] = useState(true);

    console.log("användare: ", user); // Ta bort sen 

    useEffect(() => {
      if (user !== null) {
        setLoading(false);
      }
    }, [user]);

    if (loading) {
      return <div>Laddar..</div>
    }



  return (
    <div>
        <h1>Skapa recension</h1>
        <ReviewForm />
        
    </div>
  )
}

export default CreateReviewPage