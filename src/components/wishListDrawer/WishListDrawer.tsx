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
import "./wishListDrawer.css"
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
      </ListItemButton>
    </ListItem>
  );
};


export default function Wishlist({ faVOpen, setFavOpen }: WishlistProps) {
  const [cartItems, setCartItems] = React.useState<Product[]>([]);
  const navigate = useNavigate();
  const db = getFirestore(app);

  useEffect(() => {
    const cartCollection = collection(db, "Wishlist");

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

  const toggleDrawer = (newOpen: boolean) => () => {
    setFavOpen(newOpen);
  };

  const handleCheckout = () => {
    navigate("/wishlist");
    setFavOpen(false);
  };

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation">
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
