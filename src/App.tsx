/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Categories from "./pages/catigories/Catigories";
import Products from "./pages/products/Products";
import { useState } from "react";
import Cart from "./pages/cart/Cart";
import AboutUs from "./pages/aboutUs/AboutUs";
import ContactUS from "./pages/contactUs/ContactUS";

function App() {
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signIn",
        element: <SignIn signUp={false} />,
      },
      {
        path: "/signUp",
        element: <SignUp signUp={false} />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },{
        path: "/contactUs",
        element: <ContactUS />,
      },

    ],
  },
]);
  return <RouterProvider router={router} />;
}

export default App;
