import { useState } from "react"
import { ReviewInterface } from "../types/ReviewInterface"
import { useAuth } from "../context/AuthContext"
import { useParams, useLocation, Link } from "react-router-dom"
import * as Yup from "yup";


const CreateReviewPage = () => {

    const { bookId } = useParams<{ bookId: string }>(); // Bokid från url 
    const { state } = useLocation() as { state?: { title?: string } }; // state från url 
    const bookTitle = state?.title || "Ingen titel"; // boktitel

   const { user } = useAuth(); // Hämta användare 


    // States 
    const [reviewText, setReviewText] = useState(""); // recensionstext, tom från start 
    const [rating, setRating] = useState(1); // rating - 1 från start 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); // valideringsfel 

    // Valideringsschema med Yup 
    const validationSchema = Yup.object({
        reviewText: Yup.string().trim().required("Du måste skriva något i din recension").min(5, "Recensionen måste vara minst 5 tecken lång"),
        rating: Yup.number().min(1, "Lägsta betyg är 1").max(5, "Högsta betyg är 5").required("Du måste sätta ett betyg"),
    });

    // Hantera recensionen 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!user?._id) {
            setError("Du måste logga in för att kunna lämna en recension");
            setLoading(false);
            return;
        }

        const review: ReviewInterface = {
            bookId: bookId || "",
            bookTitle: bookTitle,
            userId: user._id,
            reviewText,
            rating,
            username: user.username
        };

        console.log("skickar data: ", review); // Ta bort sen 

        // POST-anrop
        try {
            // Validera
            await validationSchema.validate(review, { abortEarly: false });

            setValidationErrors({});
            setError(null);
            setSuccess(null);



            const res = await fetch("http://localhost:5000/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...review, userId: user._id }),
                credentials: "include"
            });


            // vid fel 
            if (!res.ok) {
                throw new Error("Något blev fel vid skapande av recension");
            }

            // console.log(review); // ta bort sen 
            //  const resData = await res.json(); 

            // annars kör på 
            setSuccess("Recension har skapats!"); // lyckat meddelande 
            // Rensa formulär 
            setReviewText("");
            setRating(1);


            // fånga fel 
        } catch (error) {
            // Loopa igenom valideringsfel från yup 
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });

                setValidationErrors(errors);
            } else {
                console.error(error);
                setError("Det uppstod ett fel vid uppdatering av recensionen");
            }

        }
    }

    return (

        <div className="form-container">
            <h3>Skriv en recension</h3>
            <h4>Bok: {bookTitle}</h4>

            {error && <p className="error-msg">{error}</p>}

            {success && <p className="success-msg">{success}</p>}

            {/* Gå tillbaka till bokdetaljer */}
            <Link to={`/book/${bookId}`}>Backa</Link>

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

                {validationErrors.reviewText && <p>{validationErrors.reviewText}</p>}

                <label htmlFor="rating">Betyg:</label>
                <select id="rating" name="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                {validationErrors.rating && <p>{validationErrors.rating}</p>}

                <button type="submit">
                    Skapa recension
                </button>
            </form>

        </div>
    )
}

export default CreateReviewPage