/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import Colors from "../../utils/Colors";
import ButtonShape from "../../components/button/Button";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import ProductCard from "../../components/productCard/ProductCard";
import "./shop.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
const db = getFirestore();

interface ShopProps {}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  addedToCart?: boolean;
  rating?: number;
  categoryRef: string;
}

async function getCategoryNames() {
  const categoriesRef = collection(db, "categories");
  const snapshot = await getDocs(categoriesRef);
  return snapshot.docs.map((doc) => doc.data().name);
}

const Shop: React.FC<ShopProps> = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl,
            quantity: data.quantity,
            addedToCart: data.addedToCart || false,
            rating: data.rating || 0,
            categoryRef: data.categoryRef,
          };
        });

        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    const categoryNames = new Set();

    products.forEach((product) => {
      if (!categoryNames.has(product.categoryRef)) {
        categoryNames.add(product.categoryRef);
        console.log("New Category:", product.categoryRef);
        console.log("Category Names:", categoryNames);
      }
    });
    getCategoryNames()
      .then((names) => setCategories(names))
      .catch((error) => console.error(error));
  }, []);

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryRef == selectedCategory
      );
      console.log("Selected category:", selectedCategory);
    }
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }
    if (selectedRating) {
      filtered = filtered.filter(
        (product) => product.rating && product.rating >= selectedRating
      );
    }
    if (sortOrder) {
      filtered.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <div className="container">
        <div className="summer-sale">
          <div className="flex-2"></div>
          <div className="flex-1">
            <h3 style={{ color: Colors.White }}>Summer Sale</h3>
            <h1 style={{ color: Colors.White }}>
              <span style={{ color: Colors.Warning }}>37%</span> OFF
            </h1>
            <p style={{ color: Colors.Gray4 }}>
              Free on all your order, Free Shipping and 30 days money-back
              guarantee
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="selectors">
          <div>
            <select
              style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
              className="selector"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
              className="selector"
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="">Select Price Range</option>
              <option value="1-5">$1 - $5</option>
              <option value="5-10">$5 - $10</option>
              <option value="10-15">$10 - $15</option>
            </select>

            <select
              className="selector"
              style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars & Up
                </option>
              ))}
            </select>
          </div>

          <div className="second-selectors">
            <select
              className="selector"
              style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>

            <ButtonShape
              width="150px"
              height="45px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
              onClick={applyFilters}
              className="apply-filters"
            >
              Apply Filters
            </ButtonShape>
          </div>
        </div>
      </div>

      <div className="filter-header">
        <div className="container">
          <div className="filter-header-content">
            <div className="active">
              <p>Active Filters:</p>
              <p className="filters">
                {selectedCategory && (
                  <span className="filter">
                    <span style={{ color: Colors.Gray5 }}>
                      {selectedCategory}
                    </span>

                    <button
                      className="close-button"
                      onClick={() => setSelectedCategory("")}
                    >
                      X
                    </button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="filter">
                    <span style={{ color: Colors.Gray5 }}>
                      {selectedPriceRange}
                    </span>
                    <button
                      className="close-button"
                      onClick={() => setSelectedPriceRange("")}
                    >
                      X
                    </button>
                  </span>
                )}
                {selectedRating && (
                  <span className="filter">
                    <span style={{ color: Colors.Gray5 }}>
                      {selectedRating} Stars & Up
                    </span>
                    <button
                      className="close-button"
                      onClick={() => setSelectedRating(null)}
                    >
                      X
                    </button>
                  </span>
                )}
                {sortOrder && (
                  <span className="filter">
                    <span style={{ color: Colors.Gray5 }}>{sortOrder}</span>
                    <button
                      className="close-button"
                      onClick={() => setSortOrder("")}
                    >
                      X
                    </button>
                  </span>
                )}
              </p>
            </div>
            <div className="final-res">
              <p>
                {filteredProducts.length}{" "}
                <span style={{ color: Colors.Gray5 }}>Results found</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="results">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              quantity={product.quantity}
              addedToCart={product.addedToCart}
              rating={product.rating}
              categoryRef={product.categoryRef}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;
