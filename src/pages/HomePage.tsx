import { useState } from "react"
import BookList from "../components/BookList" // Komponent för lista med böcker 
import "./css/HomePage.css"
import homeimage from "../assets/img/homeimage.jpg"


const HomePage = () => {

  // States 
  const [search, setSearch] = useState(""); // Sökfält 


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
        <input type="text" id="search" placeholder="Sök efter bok" value={search} onChange={(e) => setSearch(e.target.value)} />
      </form>
      {/* Booklist-komponent med searchprop */}
      <BookList query={search || "subject:fiction"} />
    </>
  )
}

export default HomePage