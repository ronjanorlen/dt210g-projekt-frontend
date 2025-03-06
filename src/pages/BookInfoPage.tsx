import { useState, useEffect } from "react"
import { BookInterface } from "../types/BookInterface"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"

  // Sida för enskild bok. kunna skapa recensioner här? 

const BookInfoPage = () => {

  const { id } = useParams<{ id: string }>();  // Hämta id från url 

  // States 
  const [book, setBook] = useState<BookInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect för hämtning av bok 
  useEffect(() => {
    if (id) {
      getBook(id);
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


  return (
  
    <div className="bookDet">
      <h1>Bokdetaljer</h1>

      {/* I väntan på api */}
      {loading && (
        <div className="waiting">
          <p>
            <em>Hämtar bok..</em>
          </p>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      {book ? (
        <div>
          <h2>{book.volumeInfo.title}</h2>
          {book.volumeInfo.authors && (
            <p>
              <strong>Av:</strong> {book.volumeInfo.authors.join(", ") || "Okänd" } 
            </p>
          )}
          {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
            <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
          )}
        </div>
      ) : (
        !loading && <p>Ingen bok hittades.</p>
      )}

      <Link to="/">Tillbaka</Link>
    </div>
  )
}

export default BookInfoPage