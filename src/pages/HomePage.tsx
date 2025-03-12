import { useState } from "react"
import BookList from "../components/BookList" // Komponent för lista med böcker 
import "./css/HomePage.css"
import homeimage from "../assets/img/homeimage.jpg"


const HomePage = () => {

  // States 
  const [search, setSearch] = useState(""); // Sökfält 
  const [genre, setGenre] = useState("fiction"); // Genre, förvalt med fiction

  const genres = ["Fiction", "Mystery", "Fantasy", "Romance", "History"]; // Lista med genrer 

  // Välj genre 
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
  }


  return (
    <>
      <h1>Välkommen</h1>

      {/* Bild på startsida */}
      <div style={{ width: "100%" }}>
        <img
          src={homeimage}
          alt="Spiderman sitter i en murport med en bok i handen"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: "600px",
            objectFit: "cover"
          }}
        />
      </div>
      <h2>Sök <i className="fa-solid fa-magnifying-glass"></i></h2>

      {/* Sökformulär */}
      <form className="search-form">
        <label htmlFor="search"></label>
        <input type="text" id="search" placeholder="Ange bok eller författare" value={search} onChange={(e) => setSearch(e.target.value)} />
      </form>

      {/* Dropdown med genrer */}
      <div className="genre">
        <label htmlFor="genre">Välj från genre:</label>
        <select id="genre" value={genre} onChange={handleGenreChange}>
          {/* Loopa genre-listan */}
          {genres.map((gen) => (
            <option key={gen} value={gen}>{gen}</option>
          ))}
        </select>
      </div>

      {/* Booklist-komponent med searchprop och genre */}
      <BookList query={search || `subject:${genre}`} />
    </>
  )
}

export default HomePage