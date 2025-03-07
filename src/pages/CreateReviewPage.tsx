import ReviewForm from "../components/ReviewForm"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const CreateReviewPage = () => {

    const { user } = useAuth(); // hämta användare 



  return (
    <div>
        <h1>Skapa recension</h1>
        <ReviewForm />
    </div>
  )
}

export default CreateReviewPage