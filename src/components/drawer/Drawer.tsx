/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import "./drawer.css";
import ButtonShape from "../button/Button";
import Colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../firebase/Firebase";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

// Define the Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Props for the Drawer component
interface TemporaryDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Product Component
const ProductItem: React.FC<{
  product: Product;
  onIncrease: () => void;
  onDecrease: () => void;
}> = ({ product, onIncrease, onDecrease }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: 50, height: 50, marginRight: 16 }}
        />
        <ListItemText
          primary={product.name}
          secondary={`$${product.price.toFixed(2)}`}
        />
        <IconButton onClick={onDecrease} aria-label="reduce quantity">
          <RemoveIcon />
        </IconButton>
        <span style={{ margin: "0 8px" }}>{product.quantity}</span>
        <IconButton onClick={onIncrease} aria-label="increase quantity">
          <AddIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};

export default function TemporaryDrawer({
  open,
  setOpen,
}: TemporaryDrawerProps) {
  const [cartItems, setCartItems] = React.useState<Product[]>([]);
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
      console.log("Updated cart data:", cartData);
    });

    return () => unsubscribe();
  }, [db]);

  const handleIncreaseQuantity = async (productId: string) => {
    const productRef = doc(db, "cart", productId);
    const product = cartItems.find((item) => item.id === productId);
    if (product) {
      await updateDoc(productRef, { quantity: product.quantity + 1 });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    }
  };

  const handleDecreaseQuantity = async (productId: string) => {
    const productRef = doc(db, "cart", productId);
    const product = cartItems.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      await updateDoc(productRef, { quantity: product.quantity - 1 });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleCheckout = () => {
    navigate("/checkOut");
    setOpen(false);
  };

  const handleGoToCart = () => {
    navigate("/cart");
    setOpen(false);
  }

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation">
      <h1 className="menu-title">Cart</h1>
      <Divider />
      <List>
        {cartItems.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onIncrease={() => handleIncreaseQuantity(product.id)}
            onDecrease={() => handleDecreaseQuantity(product.id)}
          />
        ))}
      </List>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <p>{cartItems.length} Products </p>
        <p>
          $
          {cartItems
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toFixed(2)}
        </p>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <ButtonShape
          height="50px"
          width="100%"
          onClick={handleCheckout}
          textColor={Colors.White}
          backgroundColor={Colors.Primary}
        >
          Checkout
        </ButtonShape>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", paddingInline: 2 }}
      >
        <ButtonShape
          height="50px"
          width="100%"
          onClick={handleGoToCart}
          textColor={Colors.White}
          backgroundColor={Colors.Primary}
        >
          Go to Cart
        </ButtonShape>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
