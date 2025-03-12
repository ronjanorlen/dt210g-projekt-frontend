import { useState, useEffect, useRef } from "react"
import { ReviewInterface } from "../types/ReviewInterface"
import * as Yup from "yup";
import "./css/MyReviews.css"


const MyReviews = () => {
  // Komponent för recensioner per användare 

  // states 
  const [reviews, setReviews] = useState<ReviewInterface[]>([]); // recensioner 
  const [error, setError] = useState<string | null>(null); // errors 
  const [success, setSuccess] = useState<string | null>(null); // lyckat meddelande 
  const [editingReview, setEditingReview] = useState<ReviewInterface | null>(null); // redigera recension
  const [updatedText, setUpdatedText] = useState(""); // Uppdaterad recensionstext 
  const [updatedRating, setUpdatedRating] = useState(1); // uppdaterad rating  
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); // valideringsfel 
  const [loading, setLoading] = useState(false); // Laddning 

  // Rull till övre del av sida efter lyckad uppdatering 
  const reviewsRef = useRef<HTMLHeadingElement | null>(null);


  // useEffect för att hämta in recensioner
  useEffect(() => {
    fetchReviews();
  }, []);

  // useEffect för att dölja meddelande efter lyckad uppdatering 
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000); // Dölj efter 3 sek

      return () => clearTimeout(timer); // Rensa time out 
    }
  }, [success]);

  // Hämta recensioner 
  const fetchReviews = async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await fetch(`https://dt210g-projekt-backend.onrender.com/reviews/user`, {
        method: "GET",
        credentials: "include"
      });



      if (res.status === 404) {
        setReviews([]); // sätt till tom array 
        setError(null);
        return;
      }


      // om fel 
      if (!res.ok) {
        throw new Error("Det gick inte att hämta recensionerna");
      }

      // annars hämta in 
      const data = await res.json();
      setReviews(data);

      // Fånga fel 
    } catch (error) {
      console.error(error);
      setError("Misslyckades med att hämta recensioner");
    } finally {
      setLoading(false);
    }
  }

  // Ta bort recension 
  const deleteReview = async (id: string) => {

    if (!window.confirm("Vill du verkligen ta bort denna recension?")) return; // Be användare bekräfta borttagning annars avbryt 

    try {
      const res = await fetch(`https://dt210g-projekt-backend.onrender.com/reviews/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      // om inte ok 
      if (!res.ok) throw new Error("Kunde ej ta bort recension");

      // annars ta bort och uppdatera staten 
      setReviews(reviews.filter((rec) => rec._id !== id));

      // Fånga fel
    } catch (error) {
      console.error(error);
      setError("Något blev fel vid borttagning av recension");
    }
  }

  // Valideringsschema med Yup 
  const validationSchema = Yup.object({
    reviewText: Yup.string().trim().required("Du måste skriva något i din recension").min(5, "Recensionen måste vara minst 5 tecken lång"),
    rating: Yup.number().min(1, "Lägsta betyg är 1").max(5, "Högsta betyg är 5").required("Du måste sätta ett betyg"),
  });

  // Redigera recension 
  const updateReview = async (id: string) => {

    try {

      if (!editingReview) return;

      // Skapa objekt 
      const reviewData = {
        bookId: editingReview.bookId,
        bookTitle: editingReview.bookTitle,
        userId: editingReview.userId,
        reviewText: updatedText,
        rating: updatedRating
      };

      // Validera och rensa fel
      await validationSchema.validate(reviewData, { abortEarly: false });
      setValidationErrors({});
      setError(null);
      setSuccess(null);


      const res = await fetch(`https://dt210g-projekt-backend.onrender.com/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      // om inte ok 
      if (!res.ok) {
        throw new Error("Misslyckades att uppdatera recensionen");
      }

      // Uppdatera recension
      const updatedReview = await res.json();
      setReviews(reviews.map((rec) => (rec._id === editingReview._id ? updatedReview : rec)));
      setSuccess("Recensionen har uppdaterats!");

      // Rulla upp på sidan 
      reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      // återställ redigering 
      setEditingReview(null);
      setUpdatedText("");
      setUpdatedRating(1);

      // Dölj meddelande efter 3 sek 
      setTimeout(() => setSuccess(null), 3000);

      // Fånga fel 
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

  // Hantera uppdatering 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Förhindra sidomladdning 
    updateReview(editingReview?._id ?? "");
  }


  return (

    <div className="userReviews">

      <h2 ref={reviewsRef}>Mina recensioner</h2>

      {success && <p className="success">{success}</p>}

      {loading && <div id="loader"></div>}

      {error && reviews.length > 0 && <p className="error-msg">{error}</p>}

      {reviews.length === 0 && !error && (
        <p>Du har inte skrivit några recensioner ännu <i className="fa-regular fa-face-frown"></i></p>
      )}

      {reviews.length > 0 && (
        <>
          {reviews.map((review) => (
            <div key={review._id}>
              {editingReview?._id === review._id ? (
                <>
                  <form onSubmit={handleSubmit} className="userRevForm">
                    <p><strong>{editingReview?.bookTitle}</strong></p>
                    <textarea
                      id="reviewText"
                      name="reviewText"
                      value={updatedText}
                      onChange={(e) => setUpdatedText(e.target.value)}
                    />

                    {validationErrors.reviewText && <p className="err-rev">{validationErrors.reviewText}</p>}

                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      value={updatedRating}
                      onChange={(e) => setUpdatedRating(Number(e.target.value))}
                    />

                    {validationErrors.rating && <p className="err-rev">{validationErrors.rating}</p>}

                    <button className="save-btn" type="submit"><i className="fa-solid fa-check"></i> Spara</button>
                    <button className="cancel-btn" type="button" onClick={() => setEditingReview(null)}><i className="fa-solid fa-xmark"></i> Avbryt</button>
                  </form>
                </>
              ) : (
                <>
                  <h3>{review.bookTitle}</h3>
                  <p><strong>Betyg:</strong> {review.rating}/5</p>
                  <p><em>{review.reviewText}</em></p>
                  <p><strong>Skapad:</strong> {review.created ? new Date(review.created).toLocaleDateString() : ""}</p>
                  <button className="delete-btn" onClick={() => deleteReview(review._id ?? "")}><i className="fa-solid fa-trash-can"></i> Ta bort</button>
                  <button className="edit-btn" onClick={() => {
                    setEditingReview(review);
                    setUpdatedText(review.reviewText);
                    setUpdatedRating(review.rating);
                  }}>
                    <i className="fa-regular fa-pen-to-square"></i> Redigera
                  </button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MyReviews