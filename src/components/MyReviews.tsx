import { useState, useEffect } from "react"
import { ReviewInterface } from "../types/ReviewInterface"


const MyReviews = () => {
// Komponent för recensioner per användare 

// states 
const [reviews, setReviews] = useState<ReviewInterface[]>([]);
const [error, setError] = useState<string | null>(null);


// useEffect för att hämta in recensioner
useEffect(() => {
        fetchReviews();
}, []);

// Hämta recensioner 
const fetchReviews = async () => {

    try {
        const res = await fetch(`http://localhost:5000/reviews/user`, {
            method: "GET",
            credentials: "include"
        });

        

        if (res.status === 404) {
            setReviews([]); // sätt till tom array 
            return;
        }


        // om fel 
        if (!res.ok) {
            throw new Error("Det gick inte att hämta recensionerna");
        }

        // annars hämta in 
        const data = await res.json();
        console.log("console.log", data); // ta bort sen 

        setReviews(data);
        
        // Fånga fel 
    } catch (error) {
        console.error(error);
        setError("Misslyckades med att hämta recensioner");
    }
}

// Ta bort recension 
const deleteReview = async (id: string) => {

    if (!window.confirm("Vill du verkligen ta bort denna recension?")) return;

    try {
        const res = await fetch(`http://localhost:5000/reviews/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        // om inte ok 
        if (!res.ok) throw new Error("Kunde ej ta bort recension");

        // annars ta bort och uppdatera staten 
        setReviews(reviews.filter((rec) => rec._id !==id));

        // Fånga fel
    } catch (error) {
        console.error(error);
        setError("Något blev fel vid borttagning av recension");
    }
}


  return (
    
    <div className="userReviews">
        <h2>Mina recensioner</h2>

         {/* Felmeddelande */}
        {error && <p className="error-msg">{error}</p>}

         {/* skriv ut recensioner, Om det inte finns några recensioner, skriv ut meddelande */}
         {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <div key={review._id}>
              <p>{review.bookTitle}</p>
              <p>Betyg: {review.rating}/5</p> 
              <p>{review.reviewText}</p>
              <p>Skapad: {review.created ? new Date(review.created).toLocaleDateString() : ""}</p>
              <button onClick={() => deleteReview(review._id ?? "")}>Ta bort</button>
              <button>Redigera</button>
              <hr />
            </div>
          ))}
        </ul>
      ) : (
        <p>Du har inte skrivit några recensioner ännu</p>
      )}

    </div>
  )
}

export default MyReviews