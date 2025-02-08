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
import { app, db } from "../../firebase/Firebase";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import ButtonShape from "../button/Button";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import logo from "../../assets/logo.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Snackbar } from "@mui/material";


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
  onIncrease: () => void;
  onDecrease: () => void;
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
  const [sideBarImg , setSideBarImg] = useState([imageUrl]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [quantities, setQuantities] = useState(1);
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
    if(user){
      setIsFavorite(!isFavorite);

    }else{
      setNotAuthorized(true);
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

  const addToCart = async () => {
    if(user){
          if (isInCart) {
            try {
              const cartQuery = await getDocs(collection(db, "cart"));
              const cartItem = cartQuery.docs.find(
                (doc) => doc.data().name === name
              );
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
                quantity: quantities,
              });
              console.log("Product added to cart:", name);
              setIsInCart(true);
              updateProductCartStatus(true);
            } catch (error) {
              console.error("Error adding to cart:", error);
            }
          }
    } else{
      setNotAuthorized(true);
    }
  };
  useEffect(() => {
    const auth = getAuth(app);

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({ email: user.email || "" });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  const increaseQuantity = () => {
    setQuantities((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantities > 1) {
      setQuantities((prev) => prev - 1);
    }
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
        open={notAuthorized}
        onClose={() => setNotAuthorized(false)}
        message="You are not authorized to perform this action"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Danger,
          },
        }}
      />
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
        <h3
          className="name"
          style={{ color: Colors.Gray7 }}
          onClick={handleClickOpen}
        >
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
              <div className="product-images">
                <img src={sideBarImg[0]} alt={name} className="image" />
                <div className="image-sidebar">
                  {[imageUrl, logo, imageUrl, imageUrl, imageUrl].map(
                    (img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`product-${index}`}
                        className="sidebar-image"
                        onClick={() => setSideBarImg([img])}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="product-info">
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
