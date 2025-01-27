// GroceryCard.tsx
import React from "react";
import "./productCard.css"
interface GroceryCardProps {
  name: string;
  imageUrl: string;
}

const ProductCard: React.FC<GroceryCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={name} className="image" />
      <h3 className="name">{name}</h3>
    </div>
  );
};



export default ProductCard;
