// GroceryCard.tsx
import React, { useState } from "react";
import "./productCard.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Colors from "../../utils/Colors";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Product {
  id: string;
  name: string;
  price: number;
  photo: string;
  quantity: number;
}

interface GroceryCardProps {
  name: string;
  imageUrl: string;
  price: number;
  onAddToCart?: (Product: Product) => void;
  onAddToFavorites?: (Product: Product) => void;
  addedToCart?: boolean;
}

const ProductCard: React.FC<GroceryCardProps> = ({
  name,
  imageUrl,
  price,
  onAddToCart,
  addedToCart,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev); // Toggle the favorite state
  };
  const toggleCart = () => {
    setIsInCart((prev) => !prev);
    if (addedToCart === true) {
      setIsInCart(false);
    } else if (onAddToCart && !addedToCart) {
      onAddToCart({ id: name, name, price, photo: imageUrl, quantity: 1 });
    }
  };
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="image" />
      <div className="favorite-icon" onClick={toggleFavorite}>
        {isFavorite ? (
          <FavoriteIcon
            className="favorite"
            style={{ color: Colors.Primary }}
          />
        ) : (
          <FavoriteBorderIcon className="favorite" />
        )}
      </div>
      <h3 className="name" style={{ color: Colors.Gray7 }}>
        {name.length > 20 ? name.slice(0, 20) + "..." : name}
      </h3>
      <div className="price">
        <p>${price}</p>
        <div>
          {isInCart ? (
            <ShoppingCartIcon
              style={{ color: Colors.Primary }}
              className="cart"
              onClick={toggleCart}
            />
          ) : (
            <ShoppingCartIcon className="cart" onClick={toggleCart} />
          )}
        </div>
      </div>
      <div>
        <StarIcon className="star" />
        <StarIcon className="star" />
        <StarIcon className="star" />
        <StarIcon style={{ color: Colors.Gray3 }} className="star" />
      </div>
    </div>
  );
};

export default ProductCard;
