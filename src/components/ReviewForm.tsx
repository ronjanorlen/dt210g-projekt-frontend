import { useState, useEffect } from "react"
import { ReviewInterface } from "../types/ReviewInterface"
import { useAuth } from "../context/AuthContext"
import { useParams } from "react-router-dom"

const ReviewForm = () => {

    const { bookId } = useParams<{ bookId: string }>(); // Bokid från url 
    const { user } = useAuth(); // Hämta användare 

    // States 
    const [reviewText, setReviewText] = useState(""); // recensionstext, tom från start 
    const [rating, setRating] = useState(1); // rating - 1 från start 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Hantera recensionen 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const review: ReviewInterface = {
            bookId: bookId || "",
            reviewText,
            rating,
            username: "",
            createdAt: ""
        };

        console.log("skickar data: ", review); // Ta bort sen 
         

        try {
            const res = await fetch("http://localhost:5000/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(review),
                credentials: "include"
            });


            // vid fel 
            if (!res.ok) {
                throw new Error("Något blev fel vid skapande av recension");
            }

            console.log(review); // ta bort sen 
            const resData = await res.json(); // fixa 

            // annars kör på 
            setSuccess("Recension har skapats!"); // lyckat meddelande 
            setReviewText(""); // rensa recensionstext
            setRating(1); // sätt rating till 1 igen 


            // fånga fel 
        } catch (error) {
            console.error(error);
            setError("Det blev ett fel vid skapande av recension");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-container">
            <h3>Skriv en recension</h3>

            {error && <p className="error-msg">{error}</p>}

            {success && <p className="success-msg">{success}</p>}

            {/* Formulär */}
            <form className="reviewForm" onSubmit={handleSubmit}>
                <label htmlFor="reviewText">Recension:</label>
                <textarea
                    id="reviewText"
                    name="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required>
                </textarea>

                <label htmlFor="rating">Betyg:</label>
                <select id="rating" name="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? "Sparar..." : "Skapa recension"}
                </button>

            </form>
        </div>
    )
}

export default ReviewForm