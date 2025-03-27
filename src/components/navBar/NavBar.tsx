/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useEffect, useState } from "react";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";
import logoPng from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import "./NavBar.css";
import { Button, Snackbar } from "@mui/material";
import Colors from "../../utils/Colors";
import { Link } from "react-router-dom";
import TemporaryDrawer from "../drawer/Drawer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../firebase/Firebase";

import {
  collection,
  getDocs,
  Firestore,
  doc,
  query,
  where,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Wishlist from "../wishListDrawer/WishListDrawer";
import {  useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
const NavBar: React.FC<NavBarProps> = () => {
  const [, setIsShopOpen] = useState(false);
  const [, setIsPagesOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [faVOpen, setFavOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishListCount, setWishListCount] = useState(0);
  const [notAut, setNotAut] = useState(false);
  const [, setAccUser] = useState<{
    email: string;
    uid: string;
  } | null>(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
  });
  // const [darkMode, setDarkMode] = useState(
  //   () => localStorage.getItem("theme") === "dark"
  // );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
useEffect(() => {
  try {
    if (darkMode !== undefined && document.body) {
      
      document.body.classList.toggle("dark", darkMode);
      
    }
  } catch (error) {
    
    console.error("Error applying dark mode:", error);
  }
}, [darkMode]);
  getCartCount(db).then((count) => setCartCount(count));
  getWishListCount(db).then((count) => setWishListCount(count));
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (AccUser) => {
      if (AccUser) {
        setAccUser({ email: AccUser?.email || "", uid: AccUser?.uid });
        const userRef = doc(db, "users", AccUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFormData(userSnap.data() as typeof formData);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);
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
                  <div
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <img
                      src={formData.avatar || avatar}
                      alt=""
                      className="avatar"
                    />
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
          </div>
        </section>
        <TemporaryDrawer open={open} setOpen={setOpen} />
        <Wishlist faVOpen={faVOpen} setFavOpen={setFavOpen} />
      </div>
    </>
  );
};

export default NavBar;
