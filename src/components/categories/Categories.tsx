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
import cat1 from "../../assets/cat1.jpeg";
import cat2 from "../../assets/cat2.jpeg";
import cat3 from "../../assets/cat3.jpeg";
import cat4 from "../../assets/cat4.jpeg";
import cat5 from "../../assets/cat5.jpeg";
import cat6 from "../../assets/cat6.jpeg";
import cat7 from "../../assets/cat7.jpeg";
import cat8 from "../../assets/cat8.jpeg";
import cat9 from "../../assets/cat9.jpeg";
import cat10 from "../../assets/cat10.jpeg";
import cat11 from "../../assets/cat11.jpeg";

interface CategoriesProps {
  // Define your props here
}
const images = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10, cat11];
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
    .filter((category: Category) => category.name)
    .map((category: Category) => ({
      name: category.name,
      imageUrl: images[Math.floor(Math.random() * images.length)],
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
          style={{ backgroundColor: Colors.Danger }}
          className="snackbar"
        />
      </div>
    );

  return (
    <div className="catigories-container container">
      <div className="catigories-cards">
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
