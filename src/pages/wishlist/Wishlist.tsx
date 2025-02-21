/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app, db } from "../../firebase/Firebase";
import "./wishlist.css";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { Snackbar } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { getAuth, onAuthStateChanged } from "firebase/auth";
interface WishlistProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  addedToCart?: boolean;
  addedToWishlist?: boolean;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  addedToCart?: boolean;
  addedToWishlist?: boolean;
  setIsInCart?: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const Wishlist: React.FC<WishlistProps> = ({
  id,
  name,
  addedToCart: initialAddedToCart,
}) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlistChanged, setWishlistChanged] = useState(false);
  const [cartStack, setCartStack] = useState(false);
  const [cartStatus, setCartStatus] = useState<{ [key: string]: boolean }>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isInCart, setIsInCart] = useState(initialAddedToCart || false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const auth = getAuth(app);

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email || "" });
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return; // Ensure user is logged in before querying

    const cartCollection = collection(db, "Wishlist");
    const cartQuery = query(cartCollection, where("userId", "==", user.email)); // Filter by userId

    const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setCartItems(cartData);

    });

    return () => unsubscribe();
  }, [db, user]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl,
            quantity: data.quantity,
            addedToCart: data.addedToCart || false, // Ensure default value
          } as Product;
        });

        setAllProducts(productsList);

        // Set individual cart status for each product
        const cartStatusMap: { [key: string]: boolean } = {};
        productsList.forEach((product) => {
          cartStatusMap[product.id] = product.addedToCart || false;
        });

        setCartStatus(cartStatusMap);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.log("No such product document!");
        return;
      }

      const productData = productSnap.data();
      const isAlreadyInCart = productData.addedToCart;

      if (isAlreadyInCart) {
        // Remove from cart
        await deleteDoc(doc(db, "cart", productId));
        console.log("Product removed from cart:", productData.name);

        await updateDoc(productRef, { addedToCart: false });

        // Update only the clicked product's `addedToCart` state
        setCartStatus((prevStatus) => ({
          ...prevStatus,
          [productId]: false,
        }));
      } else {
        // Add to cart
        await setDoc(doc(db, "cart", productId), {
          name: productData.name,
          imageUrl: productData.imageUrl,
          price: productData.price,
          quantity: 1,
          userId: user?.email,
        });
        console.log("Product added to cart:", productData.name);

        await updateDoc(productRef, { addedToCart: true });

        // Update only the clicked product's `addedToCart` state
        setCartStatus((prevStatus) => ({
          ...prevStatus,
          [productId]: true,
        }));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    try {
      // Delete the product from the cart collection
      const cartItemRef = doc(db, "Wishlist", productId);
      await deleteDoc(cartItemRef);

      // Query the products collection to find the product by name
      const productsRef = collection(db, "products");
      const productQuery = query(productsRef, where("name", "==", productName));
      const querySnapshot = await getDocs(productQuery);

      // Check if the product exists and update the addedToCart field
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const productRef = doc(db, "products", docSnapshot.id);
          await updateDoc(productRef, { addedToWishlist: false });
        });
      }

      setWishlistChanged(true);
    } catch (error) {
      // console.error("Error deleting product from cart:", error);
      setWishlistChanged(false);
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={cartStack}
        onClose={() => setCartStack(false)}
        autoHideDuration={1000}
        message="Added to Cart"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Primary,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <div className="container">
        <div className="wishlist">
          <h1 className="title">My WishList</h1>
          <div className="wishlist-table">
            <table>
              <thead className="table-header">
                <tr>
                  <th className="cell" style={{ color: Colors.Gray5 }}>
                    PRODUCT
                  </th>
                  <th className="cell" style={{ color: Colors.Gray5 }}>
                    PRICE
                  </th>
                  <th className="cell" style={{ color: Colors.Gray5 }}>
                    STOCK STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="product">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "10px",
                        }}
                      />
                      {item.name}
                    </td>
                    <td className="">${item.price.toFixed(2)}</td>
                    <td
                      className={
                        item.quantity === 0 ? "out-of-stock" : "in-stock"
                      }
                    >
                      {item.quantity === 0 ? "Out of Stock" : "In Stock"}
                    </td>
                    <td className="actions">
                      {item.quantity !== 0 ? (
                        <>
                          <ButtonShape
                            width="100%"
                            height="40px"
                            textColor={Colors.White}
                            className="add-to-cart"
                            backgroundColor={
                              cartStatus[item.id] && user?.email === item.userId
                                ? Colors.SoftPrimary
                                : Colors.Primary
                            }
                            onClick={() => addToCart(item.id)}
                          >
                            {cartStatus[item.id] && user?.email === item.userId
                              ? "Remove from Cart"
                              : "Add to Cart"}
                            {cartStatus[item.id] &&
                            user?.email === item.userId ? (
                              <RemoveShoppingCartIcon />
                            ) : (
                              <ShoppingCartIcon />
                            )}
                          </ButtonShape>
                        </>
                      ) : (
                        <>
                          <ButtonShape
                            width="100%"
                            height="40px"
                            backgroundColor={Colors.Gray3}
                            textColor={Colors.White}
                            className="disabled"
                          >
                            Add to Cart <ShoppingCartIcon />
                          </ButtonShape>
                        </>
                      )}
                    </td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                <div className="share">
                  <p>Share :</p>
                  <div className="social-icons">
                    <FacebookIcon
                      className="icon"
                      style={{ color: Colors.Gray6 }}
                    />
                    <InstagramIcon
                      className="icon"
                      style={{ color: Colors.Gray6 }}
                    />
                    <PinterestIcon
                      className="icon"
                      style={{ color: Colors.Gray6 }}
                    />
                    <XIcon className="icon" style={{ color: Colors.Gray6 }} />
                  </div>
                </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
