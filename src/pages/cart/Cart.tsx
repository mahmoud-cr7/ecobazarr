/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import "./cart.css";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TableFooter,
} from "@mui/material";
import { collection, doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { app } from "../../firebase/Firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
interface CartProps {
  // Define your props here
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const Cart: React.FC<CartProps> = (props) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const navigate = useNavigate();
  const db = getFirestore(app);

  useEffect(() => {
    const cartCollection = collection(db, "cart");

    const unsubscribe = onSnapshot(cartCollection, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setCartItems(cartData);

      // Initialize quantities when cartItems are fetched
      setQuantities((prev) => {
        const updatedQuantities = { ...prev };
        cartData.forEach((product) => {
          if (!(product.id in updatedQuantities)) {
            updatedQuantities[product.id] = product.quantity || 1; // Default to 1 if undefined
          }
        });
        return updatedQuantities;
      });
    });

    return () => unsubscribe();
  }, [db]);
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
    alert("Cart updated successfully!");
  } catch (error) {
    console.error("Error updating cart:", error);
    alert("Failed to update cart. Please try again.");
  }
};
  return (
    <div className="container">
      <div className="cart">
        <h1 className="cart-title">My Shopping Cart</h1>
        <div className="cart-container">
          <div className="cart-products">
            <div className="cart-table">
              <table className="cart-items">
                <thead className="cart-header">
                  <tr className="cart-header-row">
                    <th className="cart-header-cell">Product</th>
                    <th className="cart-header-cell">Price</th>
                    <th className="cart-header-cell">Quantity</th>
                    <th className="cart-header-cell">SubTotal</th>
                    {/* <th className="cart-header-cell">Remove</th> */}
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
                        <button className="remove-button">x</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="cart-buttons">
                <tr>
                  <ButtonShape
                    width="100%"
                    height="40px"
                    backgroundColor={Colors.Gray1}
                    textColor={Colors.Gray7}
                  >
                    Retun to Shop
                  </ButtonShape>
                </tr>
                <tr>
                  {" "}
                  <ButtonShape
                    width="100%"
                    height="40px"
                    backgroundColor={Colors.Gray1}
                    textColor={Colors.Gray7}
                    onClick={updateCartInFirestore}
                  >
                    Update Cart
                  </ButtonShape>
                </tr>
              </div>
            </div>
            <div className="cart-coupon">
              <h1>Coupon Code</h1>
              <div className="subscribe-form-input">
                <input type="text" placeholder="Enter Coupon" />
                <ButtonShape
                  width="150px"
                  height="40px"
                  textColor={Colors.White}
                  backgroundColor={Colors.Gray8}
                >
                  Apply Coupon
                </ButtonShape>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-total">
          <h1 className="cart-total-title">Cart Total</h1>
          <div className="cart-total-items">
            <h1>SubTotal</h1>
            <h1>
              $
              {cartItems
                .reduce(
                  (acc, item) => acc + item.price * (quantities[item.id] || 1),
                  0
                )
                .toFixed(2)}
            </h1>
          </div>
          <div className="cart-total-items">
            <h1>Shipping</h1>
            <h1>Free</h1>
          </div>
          <div className="cart-total-items">
            <h1>Total</h1>
            <h1>
              $
              {cartItems
                .reduce(
                  (acc, item) => acc + item.price * (quantities[item.id] || 1),
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
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </ButtonShape>
        </div>
      </div>
    </div>
  );
};

export default Cart;
