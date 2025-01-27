/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CategoryCard from "../category/CategoryCard";
import "./Categories.css";
import SyncIcon from "@mui/icons-material/Sync";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Colors from "../../utils/Colors";
interface CategoriesProps {
  // Define your props here
}
interface Category {
  name: string;
  imageUrl?: string;
  products?: {
    image_url: string;
  }[];
}
const fetchCategories = async () => {
  const response = await axios.get(
    "https://world.openfoodfacts.org/categories.json"
  );
  return response.data.tags
    .filter((category: Category) => category.name) // Filter out categories without a name
    .map((category: Category) => ({
      name: category.name,
      imageUrl: category.products?.[0]?.image_url, // Use the first product's image as the category image
    }));
};
const Categories: React.FC<CategoriesProps> = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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
          message="An error occurred while fetching categories"
          style={{backgroundColor: Colors.Danger}}
          className="snackbar"
        />
      </div>
    );
  return (
    <div className="catigories-container container">
      <div className="grid">
        {categories?.slice(0, 10).map((category: Category, index: number) => (
          <CategoryCard
            key={index}
            name={category.name}
            imageUrl={category.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
