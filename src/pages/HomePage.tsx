import { useState } from "react"
import BookList from "../components/BookList" // Komponent för lista med böcker 


const HomePage = () => {

  // States 
  const [search, setSearch] = useState(""); // Sökfält 


  return (
    <div>
      <h1>Startsida</h1>
      <h2>Sök</h2>
      {/* Sökformulär */}
      <form className="search-form">
        <label htmlFor="search"></label>
        <input type="text" id="search" placeholder="Sök efter bok" value={search} onChange={(e) => setSearch(e.target.value)} />
      </form>
      {/* Booklist-komponent med searchprop */}
      <BookList query={search || "subject:fiction"} />
    </div>
  )
}

export default HomePage