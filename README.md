# DT210G, Fördjupad frontend-utveckling - Projekt

My Library är en webbapplikation som tillåter besökare att söka efter böcker och hantera recensioner. Applikationen använder Google Books API för att hämta information om böcker samt ett eget backend-API för hantering av användare och recensioner. Projektet är skapat som sista moment i kursen DT210G, Fördjupad frontend-utveckling, med fokus på React och TypeScript.  
Autentisering hanteras i AuthContext-filen med funktioner för att logga in, logga ut samt kontrollera användarsessionen. Denna delas till resterande komponenter för hantering av användardata.   

## Funktionalitet
* **Sökfunktion:** Sökruta för att kunna söka efter en bok.
* **Filtrera på genre:** Dropdown-meny för att filtrera böcker på genre.
* **Lista med böcker:** Visar alla böcker.
* **Användarhantering:** Möjlighet att skapa användarkonto och logga in på mina sidor.
* **Recensionshantering:** Inloggad användare kan skapa recensioner samt hantera sina egna.
* **Detaljvy för bok:** Visar mer information om boken samt eventuella recensioner som lagts.
* **Skyddade routes:** "Mina sidor" och sida för att skriva recension på en bok.
* **Responsiv design:** Anpassad till små och stora skärmar.
* **Felhantering:** Anpassade meddelanden för formulär och API-anrop.

## Pages
* HomePage: Startsida för webbplatsen
* BookInfoPage: Detaljvy för enskild bok
* CreateAccountPage: Skapa användarkonto
* LoginPage: Logga in
* MyAccountPage: Mina sidor (skyddad sida)
* CreateReviewPage: Skapa recension (skyddad sida)

## Komponenter
* BookList: Lista med böcker
* MyReviews: Skriver ut recensioner kopplad till inloggad användare
* ProtectedRoute: Hanterar skyddade sidor
* Layout, Header, Footer: Huvudstruktur och navigering för webbplatsen

## Backend
Eget backend-API med autentisering och skyddade routes för hantering av användare och recensioner. Är skapat med Hapi.js, MongoDB och Mongoose och är publicerat till render. 

## Publicering
Backend-API är publicerat till Render och My Librarys webbplats är publicerad till Netlify.

## Skapad:
**Av:** Ronja Norlén  
**Kurs:** Fördjupad frontend-utveckling  
**Program:** Webbutveckling  
**Skola:** Mittuniversitetet 