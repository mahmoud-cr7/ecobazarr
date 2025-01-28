// App.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../../components/products/products.css";
import ProductCard from "../../components/productCard/ProductCard";
import { Snackbar } from "@mui/material";
import Colors from "../../utils/Colors";
import SyncIcon from "@mui/icons-material/Sync";

interface Product {
  product_name: string;
  image_url: string;
}

const fetchGroceries = async () => {
  const response = await axios.get(
    "https://world.openfoodfacts.org/cgi/search.pl?search_terms=milk&page_size=6&json=1"
  );
  return response.data.products
    .filter((product: Product) => product.product_name && product.image_url)
    .map((product: Product) => ({
      product_name: product.product_name,
      image_url: product.image_url,
    }));
};

const App: React.FC = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({ queryKey: ["grocery"], queryFn: fetchGroceries });

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
          message="An error occurred while fetching categories"
          style={{ backgroundColor: Colors.Danger }}
          className="snackbar"
        />
      </div>
    );

  return (
    <div className="grocery-container container">
      <div className="grid">
        {products?.slice(0, 10).map((product: Product, index: number) => (
          <ProductCard
            key={index}
            name={product.product_name}
            imageUrl={product.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
