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
import CheckOut from "./pages/checkOut/CheckOut";
import Illustration from "./pages/Illustration/Illustration";
import Wishlist from "./pages/wishlist/Wishlist";
import Shop from "./pages/shop/Shop";
import Blogs from "./pages/blogs/Blogs";
import Faqs from "./pages/faqs/Faqs";

function App() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  useState(() => {
    setNewsletterOpen(true);
  });
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home newsletterOpen={newsletterOpen} />,
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
        },
        {
          path: "/contactUs",
          element: <ContactUS />,
        },
        {
          path: "/checkOut",
          element: <CheckOut />,
        },
        {
          path: "*",
          element: <Illustration />,
        },
        {
          path: "/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/faqs",
          element: <Faqs />,
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
