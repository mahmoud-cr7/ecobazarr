/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import logoPng from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import "./NavBar.css";
import { Button, Snackbar, ToggleButton } from "@mui/material";
import Colors from "../../utils/Colors";
import { Link, Navigate } from "react-router-dom";
import TemporaryDrawer from "../drawer/Drawer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../firebase/Firebase";
import CheckIcon from "@mui/icons-material/Check";
import { DarkMode, LightMode } from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleDarkMode } from "../../store/themeSlice";

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
  );
  const cartSnapshot = await getDocs(cartQuery);

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
  const [selected, setSelected] = React.useState(false);
  const [notAut, setNotAut] = useState(false);
  const navigate = useNavigate();
  // const [darkMode, setDarkMode] = useState(
  //   () => localStorage.getItem("theme") === "dark"
  // );
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);
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
  useEffect(() => {
    if (user) {
      getCartCount(db).then((count) => setCartCount(count));
      getWishListCount(db).then((count) => setWishListCount(count));
    } else {
      setCartCount(0);
      setWishListCount(0);
    }
  }, [user]);
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={notAut}
        onClose={() => setNotAut(false)}
        autoHideDuration={1000}
        message="Please Sign In First"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Danger,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <div className="navbar">
        <section className=" top">
          <div className="container section">
            <div
              className="location"
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
            >
              <AddLocationIcon className="icon" />
              Store Location: Lincoln- 344, Illinois, Chicago, USA
            </div>
            <div
              className="login"
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
            >
              {user ? (
                <>
                  {/* <span style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
                onClick={() => {
                  navigate("/profile");
                }}
                >

                  {user.email}
                </span> */}
                  <div
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <img src={avatar} alt="" className="avatar" />
                  </div>
                  <Button
                    variant="text"
                    style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
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
                    style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
                  >
                    Sign In
                  </Button>
                  /
                  <Button
                    component={Link}
                    to="/signUp"
                    variant="text"
                    style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
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
                  color: darkMode ? Colors.Gray1 : Colors.Gray6,
                }}
              />
              <input
                className="search-input"
                type="text"
                placeholder="Search..."
                style={{
                  border: `1px solid ${darkMode ? Colors.Gray3 : Colors.Gray1}`,
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
                    color: darkMode ? Colors.Gray1 : Colors.Gray6,
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
          <div className=" bottom container toggle-section">
            <div>
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
            <div className="icons-section">
              <ToggleButton
                value="theme"
                selected={darkMode}
                onClick={() => {
                  if (user) {
                    dispatch(toggleDarkMode());
                  } else {
                    setNotAut(true);
                  }
                }}
                style={{ backgroundColor: Colors.Primary }}
              >
                {darkMode ? (
                  <DarkMode style={{ color: Colors.White }} />
                ) : (
                  <LightMode style={{ color: Colors.White }} />
                )}
              </ToggleButton>
              <div
                className="language-icon"
                style={{ color: Colors.White, backgroundColor: Colors.Primary }}
                onClick={() => setSelected(!selected)}
              >
                <LanguageIcon />
                <ArrowDropDownIcon />
                {selected && (
                  <div className="language-dropdown">
                    <p style={{ color: Colors.Primary }}>English</p>
                    <p style={{ color: Colors.Primary }}>العربية</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <TemporaryDrawer open={open} setOpen={setOpen} />
        <Wishlist faVOpen={faVOpen} setFavOpen={setFavOpen} />
      </div>
    </>
  );
};

export default NavBar;
