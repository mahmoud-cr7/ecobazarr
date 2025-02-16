/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./product.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import Colors from "../../utils/Colors";
import ButtonShape from "../../components/button/Button";
import logo from "../../assets/logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
interface ProductProps {
  // Define your props here
}
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryRef: string;
}

interface GroceryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  addedToCart?: boolean;
  addedToWishlist?: boolean;
  quantity: number;
  categoryRef: string;
  onIncrease?: () => void;
  onDecrease?: () => void;
  rating?: number;
}
const Product: React.FC<GroceryCardProps> = ({
  id,
  name,
  imageUrl,
  price,
  addedToCart: initialAddedToCart,
  quantity,
  categoryRef,
  addedToWishlist: initialAddedToWishlist,
  rating,
}) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(
    initialAddedToWishlist || false
  );
  const [sideBarImg, setSideBarImg] = useState([imageUrl]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(initialAddedToCart || false);
  const { id: productId } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      if (!productId) return;

      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductData(docSnap.data() as Product);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchBlog();
  }, [productId]);
  const increaseQuantity = () => {
    setQuantities((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantities > 1) {
      setQuantities((prev) => prev - 1);
    }
  };
  const updateProductCartStatus = async (status: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { addedToCart: status });
    } catch (error) {
      console.error("Error updating product cart status:", error);
    }
  };

  const updateProductWishlistStatus = async (status: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { addedToWishlist: status });
    } catch (error) {
      console.error("Error updating product wishlist status:", error);
    }
  };

  const addToCart = async () => {
    if (isInCart) {
      try {
        const cartQuery = await getDocs(collection(db, "cart"));
        const cartItem = cartQuery.docs.find((doc) => doc.data().name === name);
        if (cartItem) {
          await deleteDoc(doc(db, "cart", cartItem.id));
        }
        console.log("Product removed from cart:", name);
        setIsInCart(false);
        updateProductCartStatus(false);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      try {
        await addDoc(collection(db, "cart"), {
          name: productData?.name,
          imageUrl: productData?.imageUrl,
          price: productData?.price,
          quantity: quantities,
        });
        console.log("Product added to cart:", name);
        setIsInCart(true);
        updateProductCartStatus(true);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };
  const addToWishlist = async () => {
    if (isInWishlist) {
      try {
        // Query the wishlist collection to find the item by name
        const wishlistQuery = await getDocs(collection(db, "Wishlist"));
        const wishlistItem = wishlistQuery.docs.find(
          (doc) => doc.data().name === name
        );

        // If the product is in the wishlist, remove it
        if (wishlistItem) {
          await deleteDoc(doc(db, "Wishlist", wishlistItem.id));
        }

        console.log("Product removed from wishlist:", name);
        setIsInWishlist(false);
        updateProductWishlistStatus(false);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      try {
        // Add the product to the wishlist
        await addDoc(collection(db, "Wishlist"), {
          name,
          imageUrl,
          price,
          quantity,
        });

        console.log("Product added to wishlist:", name);
        setIsInWishlist(true);
        updateProductWishlistStatus(true);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };
  return (
    <div className="container">
      <div className="product-details">
        <div className="product-main">
          <div className="product-images">
            <img src={sideBarImg[0]} alt={name} className="image" />
            <div className="image-sidebar">
              {[
                productData?.imageUrl,
                logo,
                productData?.imageUrl,
                productData?.imageUrl,
                productData?.imageUrl,
              ].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`product-${index}`}
                  className="sidebar-image"
                  onClick={() => img && setSideBarImg([img])}
                />
              ))}
            </div>
          </div>
          <div className="product-info">
            <h1 className="name">
              {productData?.name} <span className="stock">In Stock</span>
            </h1>
            <div className="main-details">
              <div className="details">
                <div className="rating">
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon style={{ color: Colors.Gray3 }} className="star" />
                </div>
                <p className="review">4 Review</p>
              </div>
              <p className="sku">
                <span>SKU:</span>2,51,594
              </p>
            </div>
            <div className="price">
              <h2 className="old-price" style={{ color: Colors.Gray3 }}>
                ${2 * (productData?.price ?? 0)}
              </h2>
              <h2 style={{ color: Colors.Primary }}>${productData?.price}</h2>
              <p className="discount" style={{ color: Colors.Danger }}>
                50% off
              </p>
            </div>
            <div className="brand">
              <p>Brand: {productData?.categoryRef}</p>
              <div className="social-icons">
                <FacebookIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <InstagramIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <PinterestIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <XIcon className="icon" style={{ color: Colors.Gray6 }} />
              </div>
            </div>
            <p className="description">
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel
              consequat nec, ultrices et ipsum. Nulla varius magna a consequat
              pulvinar.
            </p>
            <div className="quantity">
              <div className="quantity-selector">
                <span className="minus" onClick={decreaseQuantity}>
                  -
                </span>
                <span>{quantities}</span>
                <span className="plus" onClick={increaseQuantity}>
                  +
                </span>
              </div>
              {isInCart ? (
                <ButtonShape
                  width="120px"
                  height="58px"
                  textColor={Colors.White}
                  backgroundColor={Colors.SoftPrimary}
                  className="add-to-cart"
                  onClick={addToCart}
                >
                  Remove from Cart <RemoveShoppingCartIcon />
                </ButtonShape>
              ) : (
                <ButtonShape
                  width="120px"
                  height="58px"
                  textColor={Colors.White}
                  backgroundColor={Colors.Primary}
                  className="add-to-cart"
                  onClick={addToCart}
                >
                  Add to Cart <ShoppingCartIcon />
                </ButtonShape>
              )}
              {isInWishlist ? (
                <FavoriteIcon
                  className="FavoriteBorderIcon"
                  style={{ color: Colors.Primary }}
                  onClick={() => {
                    addToWishlist();
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  className="FavoriteBorderIcon"
                  style={{ color: Colors.Primary }}
                  onClick={() => {
                    addToWishlist();
                  }}
                />
              )}
            </div>
            <div className="category">
              <p className="categoryRef">
                Category:{" "}
                <span style={{ color: Colors.Gray3 }}>{categoryRef}</span>
              </p>
              <p className="tags">
                Tags:{" "}
                <span style={{ color: Colors.Gray3 }}>
                  {productData?.name && productData?.categoryRef ? productData.name + productData.categoryRef : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
