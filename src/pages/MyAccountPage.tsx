import { useAuth } from "../context/AuthContext"
import MyReviews from "../components/MyReviews";

const MyAccountPage = () => {

  const { user } = useAuth();

  return (
    // Inloggad användares profilsida, se och hantera alla sina recensioner 
    <>
      <h1>Mina sidor</h1>
      <h2>Välkommen {user ? user.username : ""}! <i className="fa-regular fa-face-laugh-beam"></i></h2>
      <p>Här hittar du alla dina recensioner som du har skapat.

        Vill du hantera någon av dessa, till exempel om du ångrade en recension du gjort kan du enkelt ta bort den genom att klicka på Ta bort-knappen.
        Eller vill du kanske uppdatera något? Då är det bara att klicka på Redigera-knappen och ändra i recensionstexten eller betyget och sen spara,
        så uppdateras recensionen automatiskt!
      </p>
      <MyReviews />
    </>



  )
}

export default MyAccountPage