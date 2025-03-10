import { useState, useEffect } from "react";
import { BookInterface } from "../types/BookInterface";
import { Link } from "react-router-dom";
import "./css/BookList.css"


const default_query = "subject:fiction"; // sätt ficton som default
const pageSize = 15; // Sätt 15 böcker på varje sida 

// Hämta böcker från google books, håll koll på paginering, sätt 40 som max i resultatet
const fetchBooks = async (query: string, maxResults: number = pageSize, startIndex: number = 0) => {
    try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`);
        const data = await res.json();

        return {
            books: data.items || [], // returnera items (böcker) eller tom array 
            totalBooks: data.totalItems || 0, // Antal böcker 
        };

        // Fånga fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av böcker: ", error);
        return { books: [], totalBooks: 0 };
    }
}

// Definiera komponent, ta emot query som prop 
const BookList = ({ query }: { query: string }) => {
    // state för böckerna 
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [page, setPage] = useState(1); // Håll koll på aktuell sida 
    const [totalBooks, setTotalBooks] = useState(0); // Antal böcker 

    // useEffect för att hämta böcker när komponent mountas eller query ändras, ta hänsyn till aktuell sida 
    useEffect(() => {
        const getBooks = async () => {
            const searchQuery = query.trim() ? query : default_query;
            const startIndex = (page - 1) * pageSize; 
            const { books, totalBooks } = await fetchBooks(searchQuery, pageSize, startIndex);

            setBooks(books);
            setTotalBooks(totalBooks);
        };

        getBooks();
    }, [query, page]);

    return (
        <>
        <div className="bookList">
            {books.length > 0 ? ( // Kontrollera att det finns böcker 
                books.map((book) => (
                    <div key={book.id} className="bookItem">
                        {book.volumeInfo.imageLinks?.thumbnail && ( // Kontrollera om det finns en bild 
                            <img
                                className="bookImage"
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                            />
                        )}
                        <div className="bookInfo">
                            <h3>{book.volumeInfo.title}</h3>
                            <p>Av: {book.volumeInfo.authors?.join(", ") || "Okänd"}</p>
                            <Link to={`/book/${book.id}`} key={book.id}>Mer info</Link>
                        </div>

                    </div>
                ))
            ) : (
                <p>Hittade inga böcker</p>
            )}
        </div>
           {/* Paginering */}
           <div className="pagination">
           <button disabled={page === 1} onClick={() => setPage(page - 1)}>Föregående</button>
           <span>Sida {page} av {Math.ceil(totalBooks / pageSize)}</span>

           <button disabled={page * pageSize >= totalBooks} onClick={() => setPage(page + 1)}>
               Nästa
           </button>

       </div>
       </>
    );
}

export default BookList;