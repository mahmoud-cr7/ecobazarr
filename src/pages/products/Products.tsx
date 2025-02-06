// App.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { addDoc, collection, getDocs } from "firebase/firestore";
import "../../components/products/products.css";
import ProductCard from "../../components/productCard/ProductCard";
import { Snackbar } from "@mui/material";
import Colors from "../../utils/Colors";
import SyncIcon from "@mui/icons-material/Sync";
import { db } from "../../firebase/Firebase";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  onAddToCart?: (Product: Product) => void;
  addedTocart?: boolean;
}

const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};
const addToCart = async (product: Product) => {
  try {
    await addDoc(collection(db, "cart"), {
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      addedToCart: product.addedTocart,
    });
    console.log("Product added to cart:", product.name);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
const App: React.FC = () => {
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
    <div className="grocery-container container">
      <div className="grid">
        {products?.map((product: Product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            onAddToCart={() => addToCart(product)}
            addedToCart={product.addedTocart}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
