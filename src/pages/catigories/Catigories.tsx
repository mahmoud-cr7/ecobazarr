/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "../../components/categories/categories.css";
import SyncIcon from "@mui/icons-material/Sync";
import Snackbar from "@mui/material/Snackbar";
import Colors from "../../utils/Colors";
import CategoryCard from "../../components/category/CategoryCard";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

// 🔥 Fetch categories from Firestore
const fetchCategoriesFromFirestore = async (): Promise<Category[]> => {
  const db = getFirestore();
  const categoriesCollection = collection(db, "categories");
  const querySnapshot = await getDocs(categoriesCollection);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

const Categories: React.FC = () => {
  const [errorOpen, setErrorOpen] = useState(false);

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategoriesFromFirestore,
    // onError: () => setErrorOpen(true),
  });

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  };

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

  return (
    <div className="categories-container container">
      <div className="grid container">
        {categories?.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            imageUrl={category.imageUrl}
          />
        ))}
      </div>

      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={handleClose}
        message="An error occurred while fetching categories"
        style={{ backgroundColor: Colors.Danger }}
        className="snackbar"
      />
    </div>
  );
};

export default Categories;
