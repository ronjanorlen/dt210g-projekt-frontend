import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import "./css/Layout.css"

const Layout = () => {
    return (
        <>
            <Header />
            <main>
            <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout