import { useEffect, useState } from "react"
import { ReviewInterface } from "../types/ReviewInterface"
import { useAuth } from "../context/AuthContext"
import { useParams, useLocation, Link } from "react-router-dom"
import * as Yup from "yup";
import "./css/CreateReviewPage.css"


const CreateReviewPage = () => {

    const { bookId } = useParams<{ bookId: string }>(); // Bokid från url 
    const { state } = useLocation() as { state?: { title?: string } }; // state från url 
    const bookTitle = state?.title || "Ingen titel"; // boktitel

    const { user } = useAuth(); // Hämta användare 


    // States 
    const [reviewText, setReviewText] = useState(""); // recensionstext, tom från start 
    const [rating, setRating] = useState(1); // rating - 1 från start 
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); // valideringsfel 

    // Valideringsschema med Yup 
    const validationSchema = Yup.object({
        reviewText: Yup.string().trim().required("Du måste skriva något i din recension").min(5, "Recensionen måste vara minst 5 tecken lång"),
        rating: Yup.number().min(1, "Lägsta betyg är 1").max(5, "Högsta betyg är 5").required("Du måste sätta ett betyg"),
    });

    // useEffect för att dölja meddelande efter lyckad uppdatering 
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000); // Dölj efter 3 sek

            return () => clearTimeout(timer); // Rensa time out 
        }
    }, [success]);



    // Hantera recensionen 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!user?._id) {
            setError("Du måste logga in för att kunna lämna en recension");
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

        // POST-anrop
        try {
            // Validera
            await validationSchema.validate(review, { abortEarly: false });

            setValidationErrors({});
            setError(null);
            setSuccess(null);


            const res = await fetch("https://dt210g-projekt-backend.onrender.com/reviews", {
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

            // annars kör på 
            setSuccess("Din recension har lagts till!"); // lyckat meddelande 
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
                setError("Det uppstod ett fel");
            }

        }
    }

    return (

        <div className="form-container">

            {success && <p className="success-msg">{success}</p>}

            {/* Gå tillbaka till bokdetaljer */}
            <Link to={`/book/${bookId}`} className="backToBook"><i className="fa-solid fa-chevron-left"></i> Tillbaks till bok</Link>

            <h2>Skriv en recension</h2>

            <h3>Bok: {bookTitle}</h3>

            {error && <p>{error}</p>}



            {/* Formulär */}
            <form className="reviewForm" onSubmit={handleSubmit}>
                <label htmlFor="reviewText">Vad tyckte du om boken?</label>
                <textarea
                    id="reviewText"
                    name="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required>
                </textarea>

                {validationErrors.reviewText && <p id="error-message">{validationErrors.reviewText}</p>}

                <label htmlFor="rating">Betyg:</label>
                <select id="rating" name="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                {validationErrors.rating && <p>{validationErrors.rating}</p>}

                <button type="submit" className="addBtn">
                    <i className="fa-solid fa-plus"></i> Lägg till recension
                </button>
            </form>

        </div>
    )
}

export default CreateReviewPage