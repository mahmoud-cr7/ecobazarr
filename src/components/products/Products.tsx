/* eslint-disable @typescript-eslint/no-unused-vars */
// App.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, addDoc } from "firebase/firestore";
import ProductCard from "../productCard/ProductCard";
import "./products.css";
import Colors from "../../utils/Colors";
import { Snackbar } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { db } from "../../firebase/Firebase";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  addedToCart?: boolean;
  categoryRef: string;
}
const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};


const App: React.FC = () => {
  // const [addedToCart, setAddedToCart] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProductsFromFirestore,
  });

  if (isLoading)
    return (
      <div className="loading">
        <SyncIcon
          className="loading-icon"
          style={{ color: Colors.Primary }}
          fontSize="large"
        />
      </div>
    );

  if (isError)
    return (
      <div>
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          message="An error occurred while fetching products"
          style={{ backgroundColor: Colors.Danger }}
          className="snackbar"
        />
      </div>
    );

  return (
    <div className="grocery-container">
      <div className="grid">
        {products?.slice(0, 8).map((product: Product) => (
          <ProductCard
            id={product.id}
            key={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.price}
            addedToCart={product.addedToCart}
            quantity={product.quantity}
            categoryRef={product.categoryRef}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
