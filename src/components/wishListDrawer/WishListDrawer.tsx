/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import ButtonShape from "../button/Button";
import Colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebase/Firebase";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import "./wishListDrawer.css";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// Define the Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Props for the Drawer component
interface WishlistProps {
  faVOpen: boolean;
  setFavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Product Component
const ProductItem: React.FC<{
  product: Product;
}> = ({ product }) => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: 50, height: 50, marginRight: 16 }}
        />
        <ListItemText
          style={{ color: darkMode ? Colors.White : Colors.Gray8 }}
          primary={product.name}
          secondary={`$${product.price.toFixed(2)}`}
          secondaryTypographyProps={{
            color: darkMode ? Colors.Gray3 : Colors.Gray8,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default function Wishlist({ faVOpen, setFavOpen }: WishlistProps) {
  const [cartItems, setCartItems] = React.useState<Product[]>([]);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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
    if (!user) return;
    const cartCollection = collection(db, "Wishlist");
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
      console.log("Updated cart data:", cartData);
    });

    return () => unsubscribe();
  }, [db , user]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setFavOpen(newOpen);
  };

  const handleCheckout = () => {
    navigate("/wishlist");
    setFavOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 350,
        backgroundColor: darkMode ? Colors.Gray8 : Colors.White,
        height: "100vh",
        padding: 2,
        color: darkMode ? Colors.White : Colors.Gray8,
      }}
      role="presentation"
    >
      <h1 className="menu-title">Wishlist</h1>
      <Divider />
      <List>
        {cartItems.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </List>
      <Divider />

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <ButtonShape
          height="50px"
          width="100%"
          onClick={handleCheckout}
          textColor={Colors.White}
          backgroundColor={Colors.Primary}
        >
          wishlist
        </ButtonShape>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={faVOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
