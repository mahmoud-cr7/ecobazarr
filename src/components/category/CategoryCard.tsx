// CategoryCard.tsx
import React from "react";
import "./Category.css";
interface CategoryCardProps {
  name: string;
  imageUrl?: string; // Optional image URL
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={name} className="image" />}
      <h3 className="name">{name}</h3>
    </div>
  );
};

export default CategoryCard;
