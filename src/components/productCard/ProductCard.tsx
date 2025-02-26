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
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
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
import { useNavigate } from "react-router-dom";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
  addedToWishlist?: boolean;
  quantity: number;
  categoryRef: string;
  onIncrease?: () => void;
  onDecrease?: () => void;
  rating?: number;
  cartUsers?: string[];
  wishUsers?: string[];
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
  addedToWishlist: initialAddedToWishlist,
  rating,
  cartUsers,
  wishUsers,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(initialAddedToCart || false);
  const [openDialog, setOpenDialog] = useState(false);
  const [sideBarImg, setSideBarImg] = useState([imageUrl]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [quantities, setQuantities] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(
    initialAddedToWishlist || false
  );
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  // useEffect(() => {
  //   setIsInCart(initialAddedToCart || false);
  // }, [initialAddedToCart]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          // setIsInWishlist(productData.addedToWishlist || false);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email || "" });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const updateProductCartStatus = async (status: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      if (user) {
        await updateDoc(productRef, {
          cartUsers: status ? arrayUnion(user.email) : arrayRemove(user.email),
        });
      }
    } catch (error) {
      console.error("Error updating product cart status:", error);
    }
  };
  const updateProductWishlistStatus = async (status: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      if (user) {
        await updateDoc(productRef, {
          wishUsers: status ? arrayUnion(user.email) : arrayRemove(user.email),
        });
      }
    } catch (error) {
      console.error("Error updating product wishlist status:", error);
    }
  };
  useEffect(() => {
    if (user) {
      setIsInCart(!!cartUsers?.includes(user?.email));
      setIsInWishlist(!!wishUsers?.includes(user?.email));
    }
  }, [user]);
  const addToCart = async () => {
    if (!user) {
      setNotAuthorized(true);
      return;
    }

    try {
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.error("Product not found");
        return;
      }

      const cartRef = doc(db, "cart", id); // Use the same product ID for the cart
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const updatedUsersMails = cartSnap
          .data()
          .usersMails.includes(user.email)
          ? cartSnap
              .data()
              .usersMails.filter((email: string) => email !== user.email)
          : [...cartSnap.data().usersMails, user.email];

        if (updatedUsersMails.length > 0) {
          await updateDoc(cartRef, { usersMails: updatedUsersMails });
        } else {
          await deleteDoc(cartRef); // Remove cart item if no users remain
        }

        await updateDoc(productRef, {
          cartUsers:
            updatedUsersMails.length > 0
              ? arrayUnion(user.email)
              : arrayRemove(user.email),
        });

        setIsInCart(updatedUsersMails.includes(user.email));
        updateProductCartStatus(updatedUsersMails.includes(user.email));
      } else {
        await updateDoc(productRef, {
          cartUsers: arrayUnion(user.email),
        });

        await setDoc(cartRef, {
          name,
          imageUrl,
          price,
          quantity: quantities,
          usersMails: [user.email],
        });

        setIsInCart(true);
        updateProductCartStatus(true);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

const addToWishlist = async () => {
  if (!user) {
    setNotAuthorized(true);
    return;
  }

  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error("Product not found");
      return;
    }

    const wishlistRef = doc(db, "Wishlist", id); // Use the same product ID for the wishlist
    const wishlistSnap = await getDoc(wishlistRef);

    if (wishlistSnap.exists()) {
      const updatedUsersMails = wishlistSnap
        .data()
        .usersMails.includes(user.email)
        ? wishlistSnap
            .data()
            .usersMails.filter((email: string) => email !== user.email)
        : [...wishlistSnap.data().usersMails, user.email];

      if (updatedUsersMails.length > 0) {
        await updateDoc(wishlistRef, { usersMails: updatedUsersMails });
      } else {
        await deleteDoc(wishlistRef); // Remove wishlist item if no users remain
      }

      await updateDoc(productRef, {
        wishUsers:
          updatedUsersMails.length > 0
            ? arrayUnion(user.email)
            : arrayRemove(user.email),
      });

      setIsInWishlist(updatedUsersMails.includes(user.email));
      updateProductWishlistStatus(updatedUsersMails.includes(user.email));
    } else {
      await updateDoc(productRef, {
        wishUsers: arrayUnion(user.email),
      });

      await setDoc(wishlistRef, {
        name,
        imageUrl,
        price,
        usersMails: [user.email],
      });

      setIsInWishlist(true);
      updateProductWishlistStatus(true);
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
  }
};
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
      <div
        style={{
          backgroundColor: darkMode ? Colors.Gray8 : "",
          borderColor: darkMode ? Colors.Gray7 : "",
        }}
        className="product-card"
      >
        <img src={imageUrl} alt={name} className="image" />
        <div className="favorite-icon">
          {isInWishlist? (
            <FavoriteIcon
              className="favorite"
              style={{ color: Colors.Primary }}
              onClick={addToWishlist}
            />
          ) : (
            <FavoriteBorderIcon
              className="favorite"
              style={{ color: Colors.Gray3 }}
              onClick={addToWishlist}
            />
          )}
        </div>
        <h3
          className="name"
          style={{ color: darkMode ? Colors.Gray1 : Colors.Gray7 }}
          onClick={handleClickOpen}
        >
          {name.length > 20 ? name.slice(0, 20) + "..." : name}
        </h3>
        <div className="price">
          <p>${price}</p>
          <div>
            <ShoppingCartIcon
              style={{
                color: isInCart ? Colors.Primary : "inherit",
              }}
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
        <DialogTitle
          style={{
            backgroundColor: darkMode ? Colors.Gray8 : "",
            color: darkMode ? Colors.Gray1 : Colors.Gray9,
          }}
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
        >
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
        <DialogContent
          dividers
          style={{
            backgroundColor: darkMode ? Colors.Gray8 : "",
          }}
        >
          <div
            style={{
              backgroundColor: darkMode ? Colors.Gray8 : "",
            }}
            className="product-details"
          >
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
                <h1
                  style={{ color: darkMode ? Colors.Gray1 : Colors.Gray7 }}
                  className="name"
                  onClick={() => navigate(`/product/${id}`)}
                >
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
                    <p
                      style={{ color: darkMode ? Colors.Gray1 : Colors.Gray7 }}
                      className="review"
                    >
                      4 Review
                    </p>
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
                <div
                  style={{
                    color: darkMode ? Colors.Gray1 : Colors.Gray8,
                  }}
                  className="brand"
                >
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
                <p
                style={{
                  color: darkMode ? Colors.Gray2 : Colors.Gray8
                }}
                className="description">
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
                    <span
                      style={{
                        color: darkMode ? Colors.Gray1 : Colors.Gray8,
                      }}
                    >
                      {quantities}
                    </span>
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
