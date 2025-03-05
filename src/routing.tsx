import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyAccountPage from "./pages/MyAccountPage";
import BookInfoPage from "./pages/BookInfoPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import Layout from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/login",
                element: <LoginPage />
            }, 
            {
                path: "/book/:id",
                element: <BookInfoPage />
            },
            {
                path: "/create-account",
                element: <CreateAccountPage />
            },
            {
                path: "/my-account", // Skyddad sida
                element: <MyAccountPage />
            }
        ]
    }
])

export default router;