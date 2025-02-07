/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import "./productCard.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Colors from "../../utils/Colors";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import ButtonShape from "../button/Button";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

interface Product {
  id: string;
  name: string;
  price: number;
  photo: string;
  quantity: number;
  categoryRef: string;
}

interface GroceryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  addedToCart?: boolean;
  quantity: number;
  categoryRef: string;
}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ProductCard: React.FC<GroceryCardProps> = ({
  id,
  name,
  imageUrl,
  price,
  addedToCart: initialAddedToCart,
  quantity,
  categoryRef,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(initialAddedToCart || false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    setIsInCart(initialAddedToCart || false);
  }, [initialAddedToCart]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const updateProductCartStatus = async (status: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { addedToCart: status });
    } catch (error) {
      console.error("Error updating product cart status:", error);
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
          name,
          imageUrl,
          price,
          quantity: 1,
        });
        console.log("Product added to cart:", name);
        setIsInCart(true);
        updateProductCartStatus(true);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  return (
    <>
      <div className="product-card" onClick={handleClickOpen}>
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
            <ShoppingCartIcon
              style={{ color: isInCart ? Colors.Primary : "inherit" }}
              className="cart"
              onClick={addToCart}
            />
          </div>
        </div>
        <div>
          <StarIcon className="star" />
          <StarIcon className="star" />
          <StarIcon className="star" />
          <StarIcon style={{ color: Colors.Gray3 }} className="star" />
        </div>
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        className="dialog"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Product Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="product-details">
            <div className="product-main">
              <div>
                <img src={imageUrl} alt={name} className="image" />
                <div className="image-sidebar">
                  {[imageUrl, imageUrl, imageUrl, imageUrl, imageUrl].map(
                    (img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`product-${index}`}
                        className="sidebar-image"
                      />
                    )
                  )}
                </div>
              </div>
              <div>
                <h1 className="name">
                  {name} <span className="stock">In Stock</span>
                </h1>
                <div className="main-details">
                  <div className="details">
                    <div className="rating">
                      <StarIcon className="star" />
                      <StarIcon className="star" />
                      <StarIcon className="star" />
                      <StarIcon className="star" />
                      <StarIcon
                        style={{ color: Colors.Gray3 }}
                        className="star"
                      />
                    </div>
                    <p className="review">4 Review</p>
                  </div>
                  <p className="sku">
                    <span>SKU:</span>2,51,594
                  </p>
                </div>
                <div className="price">
                  <h2 className="old-price" style={{ color: Colors.Gray3 }}>
                    ${2 * price}
                  </h2>
                  <h2 style={{ color: Colors.Primary }}>${price}</h2>
                  <p className="discount" style={{ color: Colors.Danger }}>
                    50% off
                  </p>
                </div>
                <div className="brand">
                  <p>Brand: {categoryRef}</p>
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
                  consequat nec, ultrices et ipsum. Nulla varius magna a
                  consequat pulvinar.
                </p>
                <div className="quantity">
                  <div className="quantity-selector">
                    <span className="minus">-</span>
                    <span>{quantity}</span>
                    <span className="plus">+</span>
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
                  {isFavorite ? (
                    <FavoriteIcon
                      className="FavoriteBorderIcon"
                      style={{ color: Colors.Primary }}
                      onClick={toggleFavorite}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className="FavoriteBorderIcon"
                      style={{ color: Colors.Primary }}
                      onClick={toggleFavorite}
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
                      {name + categoryRef}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default ProductCard;
