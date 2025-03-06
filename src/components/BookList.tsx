import { useState, useEffect } from "react";
import { BookInterface } from "../types/BookInterface";
import { Link } from "react-router-dom";

// sätt ficton som default
const default_query = "subject:fiction";

// Hämta böcker från google books, sätt 40 som max i resultatet
const fetchBooks = async (query: string, maxResults: number = 40, startIndex: number = 0): Promise<BookInterface[]> => {
    try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`);
        const data = await res.json();
        
        return data.items || []; // returnera items (böcker) eller tom array 
        

        // Fånga fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av böcker: ", error);
        return [];
    }
}

// Definiera komponent, ta emot query som prop 
const BookList = ({ query }: {query: string }) => {
    // state för böckerna 
    const [books, setBooks] = useState<BookInterface[]>([]);

    // useEffect för att hämta böcker när komponent mountas eller query ändras
    useEffect(() => {
        const getBooks = async () => {
            const searchQuery = query.trim() ? query : default_query; 
            const fetchedBooks = await fetchBooks(searchQuery);
            setBooks(fetchedBooks);
        };

        getBooks();
    }, [query]);

    return (
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
    );
}

export default BookList;