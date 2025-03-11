/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "./cart.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../../firebase/Firebase";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
interface Cart {
  className: string;
}
const Cart: React.FC<Cart> = ({ className }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartChanged, setCartChanged] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponAppliedSnack, setCouponAppliedSnack] = useState(false);
  const [coupon, setCoupon] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const navigate = useNavigate();
  const db = getFirestore(app);
  const couponCode = ["ECOBAZAR20", "ECOBAZAR30", "ECOBAZAR40"];

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

    const cartCollection = collection(db, "cart");
    const cartQuery = query(
      cartCollection,
      where("usersMails", "array-contains", user.email)
    );
    const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setCartItems(cartData);

      setQuantities((prev) => {
        const updatedQuantities = { ...prev };
        cartData.forEach((product) => {
          if (!(product.id in updatedQuantities)) {
            updatedQuantities[product.id] = product.quantity || 1;
          }
        });
        return updatedQuantities;
      });
    });

    return () => unsubscribe();
  }, [db, user]); // Ensure effect re-runs when the user changes

  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const updateCartInFirestore = async () => {
    try {
      const updates = cartItems.map(async (item) => {
        const itemRef = doc(db, "cart", item.id);
        return updateDoc(itemRef, { quantity: quantities[item.id] || 1 });
      });

      await Promise.all(updates);
      setCartChanged(true);
    } catch (error) {
      console.error("Error updating cart:", error);
      setCartChanged(false);
    }
  };
  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    try {
      // Delete the product from the cart collection
      const cartItemRef = doc(db, "cart", productId);
      await deleteDoc(cartItemRef);

      // Query the products collection to find the product by name
      const productsRef = collection(db, "products");
      const productQuery = query(productsRef, where("name", "==", productName));
      const querySnapshot = await getDocs(productQuery);

      // Check if the product exists and update the addedToCart field
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const productRef = doc(db, "products", docSnapshot.id);
          await updateDoc(productRef, { addedToCart: false });
        });
      }

      setCartChanged(true);
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      setCartChanged(false);
    }
  };
  const handleApplyCoupon = () => {
    if (couponApplied) {
      setCoupon(0);
      setCouponApplied(false);
      setInvalidCoupon(false);
      setCouponInput("");
      return;
    }
    if (couponCode.includes(couponInput)) {
      setCoupon(10);
      setCouponApplied(true);
      setCouponAppliedSnack(true);
      setInvalidCoupon(false);
    } else {
      setCoupon(0);
      setInvalidCoupon(true);
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={cartChanged}
        onClose={() => setCartChanged(false)}
        autoHideDuration={1000}
        message="Cart updated"
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={couponAppliedSnack}
        onClose={() => setCouponAppliedSnack(false)}
        autoHideDuration={1000}
        message="Coupon Applied 🥳"
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={invalidCoupon}
        onClose={() => setInvalidCoupon(false)}
        autoHideDuration={1000}
        message="Invalid Coupon Code"
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
      <div className={`${className}`}>
        <div className="cart">
          <h1
            style={{
              color: darkMode ? Colors.Gray1 : Colors.Gray9,
            }}
            className="cart-title"
          >
            My Shopping Cart
          </h1>
          <div className="cart-container">
            <div className="cart-products">
              <div className="cart-table">
                <table className="cart-items">
                  <thead className="cart-header">
                    <tr className="cart-header-row">
                      <th
                        className="cart-header-cell"
                        style={{
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                      >
                        Product
                      </th>
                      <th
                        style={{
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                        className="cart-header-cell"
                      >
                        Price
                      </th>
                      <th
                        style={{
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                        className="cart-header-cell"
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                        className="cart-header-cell"
                      >
                        SubTotal
                      </th>
                      <th
                        style={{
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                        className="cart-header-cell"
                      >
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="cart-body">
                    {cartItems.map((product) => (
                      <tr key={product.id} className="cart-item">
                        <td className="cart-item-info">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: 50, height: 50 }}
                          />
                          {product.name}
                        </td>
                        <td className="cart-item-value">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="cart-item-value">
                          <div className="quantity-selector">
                            <span
                              className="minus"
                              onClick={() => decreaseQuantity(product.id)}
                            >
                              -
                            </span>
                            <span>{quantities[product.id]}</span>
                            <span
                              className="plus"
                              onClick={() => increaseQuantity(product.id)}
                            >
                              +
                            </span>
                          </div>
                        </td>
                        <td className="cart-item-value cart-item-total">
                          ${(product.price * quantities[product.id]).toFixed(2)}
                        </td>
                        <td className="cart-item-remove-button">
                          {" "}
                          <p
                            className="remove-button"
                            onClick={() =>
                              handleDeleteProduct(product.id, product.name)
                            }
                          >
                            x
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="cart-buttons">
                  <ButtonShape
                    width="100%"
                    height="40px"
                    backgroundColor={Colors.Gray1}
                    textColor={Colors.Gray7}
                  >
                    Return to Shop
                  </ButtonShape>
                  <ButtonShape
                    width="100%"
                    height="40px"
                    backgroundColor={Colors.Gray1}
                    textColor={Colors.Gray7}
                    onClick={updateCartInFirestore}
                  >
                    Update Cart
                  </ButtonShape>
                </div>
              </div>
              <div className="cart-coupon">
                <h1>Coupon Code</h1>
                <div className="subscribe-form-input">
                  <input
                    type="text"
                    placeholder="Enter Coupon"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={couponApplied}
                    className={couponApplied ? "not-available" : ""}
                  />
                  <ButtonShape
                    width="150px"
                    height="40px"
                    textColor={Colors.White}
                    backgroundColor={Colors.Gray8}
                    onClick={handleApplyCoupon}
                    className={couponApplied ? "not-available-btn" : ""}
                  >
                    {couponApplied ? "Remove Coupon" : "Apply Coupon"}
                  </ButtonShape>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-total">
            <h1
              style={{
                color: darkMode ? Colors.Gray1 : Colors.Gray9,
              }}
              className="cart-total-title"
            >
              Cart Total
            </h1>
            <div className="cart-total-items">
              <h1>SubTotal</h1>
              <h1>
                $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc + item.price * (quantities[item.id] || 1),
                    0
                  )
                  .toFixed(2)}
              </h1>
            </div>
            <div className="cart-total-items">
              <h1>Shipping</h1>
              <h1>10</h1>
            </div>
            <div
              className={`cart-total-items ${couponApplied ? "" : "hidden"}`}
            >
              <h1>Coupon</h1>
              <h1>
                -$
                {coupon}
              </h1>
            </div>
            <div className="cart-total-items">
              <h1>Total</h1>
              <h1>
                $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc +
                      item.price * (quantities[item.id] || 1) +
                      10 -
                      coupon,
                    0
                  )
                  .toFixed(2)}
              </h1>
            </div>
            <ButtonShape
              width="100%"
              height="40px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
              onClick={() => {
                navigate("/checkout");
                updateCartInFirestore();
              }}
            >
              Proceed to Checkout
            </ButtonShape>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
