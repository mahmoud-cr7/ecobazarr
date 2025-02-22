/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import logoPng from "../../assets/logo.png";
import "./NavBar.css";
import { Button } from "@mui/material";
import Colors from "../../utils/Colors";
import { Link, Navigate } from "react-router-dom";
import TemporaryDrawer from "../drawer/Drawer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../firebase/Firebase";
import {
  collection,
  getDocs,
  Firestore,
  addDoc,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Wishlist from "../wishListDrawer/WishListDrawer";
interface NavBarProps {
  // Define your props here
}
const getCartCount = async (db: Firestore): Promise<number> => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently signed-in user

  if (!user) return 0; // If no user is logged in, return 0

  const cartCollection = collection(db, "cart");
  const cartQuery = query(
    cartCollection,
    where("usersMails", "array-contains", user.email)
  );
  const cartSnapshot = await getDocs(cartQuery);

  return cartSnapshot.size; // Returns the number of matching documents
};
const getWishListCount = async (db: Firestore): Promise<number> => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently signed-in user

  if (!user) return 0; // If no user is logged in, return 0

  const cartCollection = collection(db, "Wishlist");
  const cartQuery = query(
    cartCollection,
    where("usersMails", "array-contains", user.email)
  );  const cartSnapshot = await getDocs(cartQuery);

  return cartSnapshot.size; // Returns the number of matching documents
};
const NavBar: React.FC<NavBarProps> = (props) => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [faVOpen, setFavOpen] = React.useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishListCount, setWishListCount] = useState(0);
  const navigate = useNavigate();

  getCartCount(db).then((count) => setCartCount(count));
  getWishListCount(db).then((count) => setWishListCount(count));

  useEffect(() => {
    const auth = getAuth(app);

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({ email: user.email || "" });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="navbar">
      <section className=" top">
        <div className="container section">
          <div className="location" style={{ color: Colors.Gray6 }}>
            <AddLocationIcon className="icon" />
            Store Location: Lincoln- 344, Illinois, Chicago, USA
          </div>
          <div className="login" style={{ color: Colors.Gray6 }}>
            {user ? (
              <>
                <span>{user.email}</span>
                <Button
                  variant="text"
                  style={{ color: Colors.Gray6 }}
                  onClick={() => {
                    const auth = getAuth(app);
                    auth.signOut();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/signIn"
                  variant="text"
                  style={{ color: Colors.Gray6 }}
                >
                  Sign In
                </Button>
                /
                <Button
                  component={Link}
                  to="/signUp"
                  variant="text"
                  style={{ color: Colors.Gray6 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
      <section className=" mid ">
        <div className="container section">
          <div className="logo">
            <img src={logoPng} alt="logoPng" />
            ECOBAZAR
          </div>
          <div className="search">
            <SearchIcon
              className="search-icon"
              style={{
                color: Colors.Gray6,
              }}
            />
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              style={{
                border: `1px solid ${Colors.Gray1}`,
              }}
            />
            <Button
              variant="contained"
              className="search-button"
              style={{
                backgroundColor: Colors.Primary,
              }}
            >
              Search
            </Button>
          </div>
          {user ? (
            <>
              <div
                className="icons"
                style={{
                  color: Colors.Gray6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="shop-icon"
                  onClick={() => {
                    setFavOpen(!faVOpen);
                  }}
                >
                  <FavoriteBorderIcon className="icon" />
                  {wishListCount > 0 && (
                    <span className="cart-badge">{wishListCount}</span>
                  )}
                </div>
                |
                <div
                  className="shop-icon"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <ShoppingBagIcon className="icon" />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </section>
      <section className="" style={{ backgroundColor: Colors.Gray8 }}>
        <div className=" bottom container">
          <Button
            component={Link}
            to="/"
            className="button"
            style={{ color: Colors.White }}
          >
            Home
          </Button>
          <div className="dropdown">
            <Button
              component={Link}
              to="/shop"
              className="button"
              style={{ color: Colors.White }}
            >
              Shop
            </Button>
          </div>
          {/* <div className="dropdown">
            <button
              onClick={() => {
                setIsPagesOpen(!isPagesOpen);
                setIsShopOpen(false);
              }}
            >
              Pages
              <ArrowDropDownIcon />
            </button>
            {isPagesOpen && (
              <div
                className="dropdown-content"
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <a href="#">Option 1</a>
                <a href="#">Option 2</a>
                <a href="#">Option 3</a>
              </div>
            )}
          </div> */}
          <Button className="button" onClick={() => navigate("/blogs")}>
            Blogs
          </Button>
          <Button
            className="button"
            onClick={() => {
              navigate("/aboutUs");
              setIsPagesOpen(false);
              setIsShopOpen(false);
            }}
          >
            About Us
          </Button>
          <Button
            className="button"
            onClick={() => {
              navigate("/contactUs");
              setIsPagesOpen(false);
              setIsShopOpen(false);
            }}
          >
            Contact Us
          </Button>
        </div>
      </section>
      <TemporaryDrawer open={open} setOpen={setOpen} />
      <Wishlist faVOpen={faVOpen} setFavOpen={setFavOpen} />
    </div>
  );
};

export default NavBar;

// const uploadCategories = async () => {
//   const categoriesCollection = collection(db, "categories");

//   for (const category of categories) {
//     await addDoc(categoriesCollection, category);
//   }

//   console.log("Categories added successfully!");
// };

// uploadCategories();
