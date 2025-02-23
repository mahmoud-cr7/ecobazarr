/* eslint-disable @typescript-eslint/no-unused-vars */
// CategoryCard.tsx
import React from "react";
import "./Category.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Colors from "../../utils/Colors";
interface CategoryCardProps {
  name: string;
  imageUrl?: string; // Optional image URL
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div
      style={{
        backgroundColor: darkMode ? Colors.Gray8 : "",
        borderColor: darkMode ? Colors.Gray7 : "",
      }}
      className="card"
    >
      <img src={imageUrl} alt={name} className="image" />
      <h3 style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }} className="name">
        {name}
      </h3>
    </div>
  );
};

export default CategoryCard;
