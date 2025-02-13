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
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
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
  useEffect(() => {
    const cartCollection = collection(db, "Wishlist");
    const unsubscribe = onSnapshot(cartCollection, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setCartItems(cartData);
    });

    return () => unsubscribe();
  }, []);
  console.log(cartItems);

  useEffect(() => {
    setCartStatus((prev) => ({ ...prev, [id]: initialAddedToCart || false }));
  }, [id, initialAddedToCart]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsCollection = collection(db, "products"); // Replace "products" with your collection name
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl,
            quantity: data.quantity,
          } as Product;
        });
        setAllProducts(productsList);
        // console.log(productsList);
        return productsList;
      } catch (error) {
        // console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, [id]);
  const status = (productName: string): boolean =>
    allProducts.some((product) => product.addedToCart);

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
      console.error("Error deleting product from cart:", error);
      setWishlistChanged(false);
    }
  };
  const updateProductCartStatus = async (
    productName: string,
    status: boolean
  ) => {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("name", "==", productName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const productRef = doc(db, "products", docSnapshot.id);
          await updateDoc(productRef, { addedToCart: status });

          console.log(`Updated ${productName}: addedToCart = ${status}`);
        });
      } else {
        console.warn(
          `Product with name "${productName}" not found in Firestore.`
        );
      }
    } catch (error) {
      console.error("Error updating product cart status:", error);
    }
  };

  const addToCart = async (productId: string, productName: string) => {
    const product = cartItems.find((item) => item.id === productId);

    if (!product) {
      console.error(`Product "${productName}" not found in wishlist.`);
      return;
    }

    const isCurrentlyInCart = cartStatus[productId] || false;

    if (isCurrentlyInCart) {
      try {
        const cartQuery = await getDocs(collection(db, "cart"));
        const cartItem = cartQuery.docs.find(
          (doc) => doc.data().name === product.name
        );

        if (cartItem) {
          await deleteDoc(doc(db, "cart", cartItem.id));
        }

        console.log(`Removed "${product.name}" from cart.`);
        setCartStatus((prev) => ({ ...prev, [productId]: false }));
        updateProductCartStatus(product.name, false);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      try {
        await addDoc(collection(db, "cart"), {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        });

        console.log(`Added "${product.name}" to cart.`);
        setCartStack(true);
        setCartStatus((prev) => ({ ...prev, [productId]: true }));
        updateProductCartStatus(product.name, true);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
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
                              status(item.name)
                                ? Colors.SoftPrimary
                                : Colors.Primary
                            }
                            onClick={() => addToCart(item.id, item.name)} // Pass `item.id` instead of calling addToCart directly
                          >
                            {status(item.name)
                              ? "Remove from Cart"
                              : "Add to Cart"}
                            {status(item.name) ? (
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
