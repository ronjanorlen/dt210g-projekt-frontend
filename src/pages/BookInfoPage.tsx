import { useState, useEffect } from "react"
import { BookInterface } from "../types/BookInterface"
import { ReviewInterface } from "../types/ReviewInterface"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import "./css/BookInfoPage.css"

// Sida för enskild bok. kunna skapa recensioner här? 

const BookInfoPage = () => {

  const { id } = useParams<{ id: string }>();  // Hämta id från url 

  // States 
  const [book, setBook] = useState<BookInterface | null>(null);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect för hämtning av bok och recensioner 
  useEffect(() => {
    if (id) {
      getBook(id);
      getReviews(id);
    }
  }, [id]);

  // Hämta bok 
  const getBook = async (bookId: string) => {

    try {

      setLoading(true);
      setError(null);

      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);

      // om response inte ok 
      if (!res.ok) {
        throw new Error("Kunde inte hämta boken");
      }
      // om ok, hämta bok 
      const data = await res.json();

      setBook(data);

      // fånga fel 
    } catch (error) {
      console.log(error);
      setError("Nåogt gick fel vid hämtning av bok");
    } finally {
      setLoading(false);
    }
  }

  // Hämta recensioner till boken 
  const getReviews = async (bookId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/reviews?bookId=${bookId}`);

      // om inte ok 
      if (!res.ok) {
        if (res.status === 404) {
          setReviews([]); // om inga recensioner finns, sätt tom array 
        } else { // ananrs kasta fel
          throw new Error("Kunde inte hämta recensionerna");
        }

      } else {
        // om ok 
        const data = await res.json();

        setReviews(data);
      }

      // Fånga fel 
    } catch (error) {
      console.log(error);
      setError("Något gick fel vid hämtning av recensionerna");
    }
  }


  return (

    <div className="bookDet">

      <h1>Bokdetaljer</h1>
      {/* Tillbaks till startsida */}
      <Link to="/" className="backToStart"><i className="fa-solid fa-chevron-left"></i> Alla böcker</Link>


      {/* I väntan på api */}
      {loading && <div className="loader"></div>}

      {error && <p className="error-msg">{error}</p>}

      {/* Skriv ut bok */}
      {book ? (
        <div>
          <h2>{book.volumeInfo.title}</h2>
          {book.volumeInfo.authors && (
            <p>
              <strong>Av:</strong> {book.volumeInfo.authors.join(", ") || "Okänd"}
            </p>
          )}
          {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
            <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
          )}
        </div>
      ) : (
        !loading && <p>Ingen bok hittades.</p>
      )}


      {/* Till formulär för att skriva recension */}
      {book && (
        <Link
          to={`/create-review/${book.id}`} state={{ title: book.volumeInfo.title }} className="addRev">
          Skriv en recension <i className="fa-solid fa-pencil"></i>
        </Link>
      )}
      <p className="obs"><em>*Du måste vara inloggad för att skriva en recension</em></p>


      {/* Skriv ut recensioner för boken */}
      <h2>Recensioner</h2>

      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review._id}>
              <p><strong>Av: {review.username}</strong></p>
              <p>Betyg: {review.rating}/5</p>
              <p><i className="fa-solid fa-quote-left"></i> {review.reviewText} <i className="fa-solid fa-quote-right"></i></p>
              <p><em>Skapad: {review.created ? new Date(review.created).toLocaleDateString() : ""}</em></p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Denna bok har inte fått någon recension än</p>
      )}
    </div>
  )
}

export default BookInfoPage