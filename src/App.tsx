import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
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
        element: <SignIn />,
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
