/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./product.css";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app, db } from "../../firebase/Firebase";
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
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/productCard/ProductCard";
import videoPng from "../../assets/Video.png";
import discountPng from "../../assets/discount_icon.png";
import leafPng from "../../assets/lief.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import avatar from "../../assets/avatar.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryRef: string;
  addedToCart?: boolean;
  cartUsers?: string[];
  wishUsers?: string[];
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
const commentsData = [
  {
    name: "Kristin Watson",
    rating: 5,
    comment: "Duis at ullamcorper nulla, eu dictum eros.",
    time: "2 min ago",
  },
  {
    name: "Jane Cooper",
    rating: 4,
    comment:
      "Keep the soil evenly moist for the healthiest growth. If the sun gets too hot, Chinese cabbage tends to 'bolt' or go to seed; in long periods of heat, some kind of shade may be helpful. Watch out for snails, as they will harm the plants.",
    time: "30 Apr, 2021",
  },
  {
    name: "Jacob Jones",
    rating: 5,
    comment:
      "Vivamus eget euismod magna. Nam sed lacinia nibh, et lacinia lacus.",
    time: "2 min ago",
  },
  {
    name: "Ralph Edwards",
    rating: 5,
    comment:
      "200+ Canton Pak Choi Bok Choy Chinese Cabbage Seeds Heirloom Non-GMO Productive Brassica rapa VAR. chinensis, a.k.a. Canton's Choice, Bok Choi, from USA",
    time: "2 min ago",
  },
];
const Product: React.FC<GroceryCardProps> = ({
  id,
  name,
  imageUrl,
  addedToCart: initialAddedToCart,
  addedToWishlist: initialAddedToWishlist,
}) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(
    initialAddedToWishlist || false
  );
  const [sideBarImg, setSideBarImg] = useState([imageUrl]);
  const [isInCart, setIsInCart] = useState(initialAddedToCart || false);
  const [tabIndex, setTabIndex] = useState(0);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const { id: productId } = useParams();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductData(docSnap.data() as Product);
          setIsInCart(docSnap.data().addedToCart);
          setIsInWishlist(docSnap.data().wishUsers?.includes(user?.email));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProduct();
  }, [productId]);
  const increaseQuantity = () => {
    setQuantities((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantities > 1) {
      setQuantities((prev) => prev - 1);
    }
  };

  // Sync UI state when productData changes
  useEffect(() => {
    if (productData && user) {
      setIsInCart(!!productData?.cartUsers?.includes(user?.email));
      setIsInWishlist(!!productData?.wishUsers?.includes(user?.email));
    }
  }, [productData, user]);
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
      if (user) {
        await updateDoc(productRef, {
          wishUsers: status ? arrayUnion(user.email) : arrayRemove(user.email),
        });
      }
    } catch (error) {
      console.error("Error updating product wishlist status:", error);
    }
  };
  const addToCart = async () => {
    if (!user) {
      setNotAuthorized(true);
      return;
    }

    try {
      if (!productId) {
        console.error("Product ID is undefined");
        return;
      }

      if (!productId) {
        console.error("Product ID is undefined");
        return;
      }
      if (!productId) {
        console.error("Product ID is undefined");
        return;
      }
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.error("Product not found");
        return;
      }

      const cartRef = doc(db, "cart", productId); // Use the same product ID for the cart document
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        // User is toggling their cart status
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
        // Product is not in cart yet, add it
        await updateDoc(productRef, {
          cartUsers: arrayUnion(user.email),
        });

        await setDoc(cartRef, {
          name: productData?.name,
          imageUrl: productData?.imageUrl,
          price: productData?.price,
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
  if (!productId) {
    console.error("Product ID is undefined");
    return;
  }
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error("Product not found");
      return;
    }

    const wishlistRef = doc(db, "Wishlist", productId); // Use the same product ID for the wishlist
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
        name: productData?.name,
        imageUrl: productData?.imageUrl,
        price: productData?.price,
        usersMails: [user.email],
      });

      setIsInWishlist(true);
      updateProductWishlistStatus(true);
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
  }
};
  const fetchProductsFromFirestore = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  };
  const {
    data: products,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProductsFromFirestore,
  });
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
              <h1
                style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
                className="name"
              >
                {productData?.name} <span className="stock">In Stock</span>
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
                    style={{ color: darkMode ? Colors.Gray4 : Colors.Gray9 }}
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
                {isInWishlist? (
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
                  <span style={{ color: Colors.Gray3 }}>
                    {productData?.categoryRef}
                  </span>
                </p>
                <p className="tags">
                  Tags:{" "}
                  <span style={{ color: Colors.Gray3 }}>
                    {productData?.name && productData?.categoryRef
                      ? productData.name + productData.categoryRef
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="tabs">
          <div
            className={`feedback-tab tab ${tabIndex === 0 ? "active" : ""}`}
            style={{ color: Colors.Gray4 }}
            onClick={() => setTabIndex(0)}
          >
            <h2>Description</h2>
          </div>
          <div
            className={`feedback-tab tab ${tabIndex === 1 ? "active" : ""}`}
            style={{ color: Colors.Gray4 }}
            onClick={() => setTabIndex(1)}
          >
            <h2>Additional Information</h2>
          </div>
          <div
            className={`feedback-tab tab ${tabIndex === 2 ? "active" : ""}`}
            style={{ color: Colors.Gray4 }}
            onClick={() => setTabIndex(2)}
          >
            <h2>Customer Feedback</h2>
          </div>
        </div>
      </div>
      <div className="bar"></div>
      <div className="container">
        <div className="tabs-content">
          <div className="tab-description">
            {tabIndex === 0 && (
              <>
                <div className="description">
                  <p style={{ color: Colors.Gray5 }}>
                    Sed commodo aliquam dui ac porta. Fusce ipsum felis,
                    imperdiet at posuere ac, viverra at mauris. Maecenas
                    tincidunt ligula a sem vestibulum pharetra. Maecenas auctor
                    tortor lacus, nec laoreet nisi porttitor vel. Etiam
                    tincidunt metus vel dui interdum sollicitudin. Mauris sem
                    ante, vestibulum nec orci vitae, aliquam mollis lacus. Sed
                    et condimentum arcu, id molestie tellus. Nulla facilisi. Nam
                    scelerisque vitae justo a convallis. Morbi urna ipsum,
                    placerat quis commodo quis, egestas elementum leo. Donec
                    convallis mollis enim. Aliquam id mi quam. Phasellus nec
                    fringilla elit.
                  </p>
                  <p style={{ color: Colors.Gray5 }}>
                    Nulla mauris tellus, feugiat quis pharetra sed, gravida ac
                    dui. Sed iaculis, metus faucibus elementum tincidunt, turpis
                    mi viverra velit, pellentesque tristique neque mi eget
                    nulla. Proin luctus elementum neque et pharetra.{" "}
                  </p>
                  <ul>
                    <li style={{ color: Colors.Gray5 }}>
                      <CheckCircleIcon style={{ color: Colors.Primary }} />
                      100 g of fresh leaves provides.
                    </li>
                    <li style={{ color: Colors.Gray5 }}>
                      <CheckCircleIcon style={{ color: Colors.Primary }} />
                      Aliquam ac est at augue volutpat elementum.
                    </li>
                    <li style={{ color: Colors.Gray5 }}>
                      <CheckCircleIcon style={{ color: Colors.Primary }} />
                      Quisque nec enim eget sapien molestie.
                    </li>
                    <li style={{ color: Colors.Gray5 }}>
                      <CheckCircleIcon style={{ color: Colors.Primary }} />
                      Proin convallis odio volutpat finibus posuere.
                    </li>
                  </ul>
                  <p style={{ color: Colors.Gray5 }}>
                    Cras et diam maximus, accumsan sapien et, sollicitudin
                    velit. Nulla blandit eros non turpis lobortis iaculis at ut
                    massa.{" "}
                  </p>
                </div>
              </>
            )}
            {tabIndex === 1 && (
              <>
                <ul className="additional-info">
                  <li>
                    <span
                      style={{
                        color: darkMode ? Colors.Gray0_5 : Colors.Gray9,
                      }}
                    >
                      Weight:
                    </span>
                    <span className="value" style={{ color: Colors.Gray6 }}>
                      03
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        color: darkMode ? Colors.Gray0_5 : Colors.Gray9,
                      }}
                    >
                      Type:
                    </span>
                    <span style={{ color: Colors.Gray6 }}>Organic</span>
                  </li>
                  <li>
                    <span
                      style={{
                        color: darkMode ? Colors.Gray0_5 : Colors.Gray9,
                      }}
                    >
                      Category:
                    </span>
                    <span style={{ color: Colors.Gray6 }}>
                      {productData?.categoryRef}
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        color: darkMode ? Colors.Gray0_5 : Colors.Gray9,
                      }}
                    >
                      Stock Status:
                    </span>
                    <span style={{ color: Colors.Gray6 }}>
                      Available ({productData?.quantity})
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        color: darkMode ? Colors.Gray0_5 : Colors.Gray9,
                      }}
                    >
                      Tags:{" "}
                    </span>
                    <span style={{ color: Colors.Gray6 }}>
                      {productData?.name && productData?.categoryRef
                        ? productData.name + productData.categoryRef
                        : ""}
                    </span>
                  </li>
                </ul>
              </>
            )}
            {tabIndex === 2 && (
              <>
                <div className="comments">
                  {commentsData.map((comment) => (
                    <div className="comment">
                      <div className="user">
                        <div className="user-info">
                          <img src={avatar} alt="" className="avatar" />
                          <div>
                            <h2>{comment.name}</h2>
                            <div className="rating">
                              {[...Array(comment.rating)].map((_, index) => (
                                <StarIcon key={index} className="star" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="time" style={{ color: Colors.Gray5 }}>
                          {comment.time}
                        </p>
                      </div>
                      <p
                        className="comment-text"
                        style={{ color: Colors.Gray5 }}
                      >
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="tab-discount">
            <img src={videoPng} alt="" />
            <div className="discounts">
              <div className="discount">
                <img src={discountPng} alt="" className="icon" />
                <div>
                  <h2>64% Discount</h2>
                  <p style={{ color: Colors.Gray4 }}>
                    Save your 64% money with us
                  </p>
                </div>
              </div>
              <div className="discount">
                <img src={leafPng} alt="" className="icon" />
                <div>
                  <h2>100% Organic</h2>
                  <p style={{ color: Colors.Gray4 }}>100% Organic Vegetables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h1 className="related-products-title">Related Products</h1>
        <div className="related-products">
          {products
            ?.filter(
              (product) => product.categoryRef === productData?.categoryRef
            )
            .slice(0, 4)
            .map((product) => (
              <ProductCard
                id={product.id}
                key={product.id}
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.price}
                addedToCart={product.addedToCart}
                quantity={product.quantity}
                categoryRef={product.categoryRef}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Product;
