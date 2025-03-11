import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Colors from "../../utils/Colors";
import "./checkOut.css";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase/Firebase";
import ButtonShape from "../../components/button/Button";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <ListItem disablePadding>
      <ListItemButton>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: 50, height: 50, marginRight: 16 }}
        />
        <ListItemText
          primary={product.name}
          secondary={`X${product.quantity}`}
          secondaryTypographyProps={{
            color: darkMode ? Colors.Gray3 : Colors.Gray8,
          }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        />
        <span style={{ margin: "0 -13px" }}>{`$${(
          product.quantity * product.price
        ).toFixed(2)}`}</span>
      </ListItemButton>
    </ListItem>
  );
};

const CheckOut: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("cash"); // Default to Cash on Delivery
  const [shippingType, setShippingType] = useState<string>("cash"); // Default to Cash on Delivery
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  const db = getFirestore(app);

  useEffect(() => {
    const cartCollection = collection(db, "cart");

    const unsubscribe = onSnapshot(cartCollection, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setCartItems(cartData);
      console.log("Updated cart data:", cartData);
    });

    return () => unsubscribe();
  }, [db]);

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "in", label: "India" },
  ];

  const countryStates: { [key: string]: string[] } = {
    us: ["California", "Texas", "New York", "Florida"],
    ca: ["Ontario", "Quebec", "British Columbia", "Alberta"],
    uk: ["England", "Scotland", "Wales", "Northern Ireland"],
    au: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
    in: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"],
  };

  const paymentOptions = [
    { value: "cash", label: "Cash on Delivery" },
    { value: "paypal", label: "PayPal (Free Shipping)" },
    { value: "amazon-pay", label: "Amazon Pay (Free Shipping)" },
  ];

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState("");
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const paymentMethod = event.target.value;
    setSelectedPayment(paymentMethod);
    setShippingType(paymentMethod); // Update shipping type based on payment method
  };

  // Calculate shipping cost
  const calculateShippingCost = () => {
    return shippingType === "cash" ? 10 : 0; // $10 for PayPal/Amazon Pay, free for Cash on Delivery
  };

  // Calculate total cost (subtotal + shipping)
  const calculateTotalCost = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return subtotal + calculateShippingCost();
  };

  const states = selectedCountry ? countryStates[selectedCountry] : [];
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="container">
      <div className="checkout">
        <div className="billing-info">
          <h1
            style={{
              color: darkMode ? Colors.Gray1 : Colors.Gray9,
            }}
            className="title"
          >
            Billing Information
          </h1>
          <div className="identity">
            <div className="input-div">
              <label htmlFor="name-input">First name</label>
              <input
                type="text"
                placeholder="Your first name"
                className="name-input"
                id="name-input"
              />
            </div>
            <div className="input-div">
              <label htmlFor="last-name-input">Last name</label>
              <input
                type="text"
                placeholder="Your last name"
                className="last-name-input"
                id="last-name-input"
              />
            </div>
            <div className="input-div">
              <label htmlFor="company-name">Company Name (optional)</label>
              <input
                type="text"
                placeholder="Company name"
                className="company-name"
                id="company-name"
              />
            </div>
          </div>
          <div className="address">
            <label htmlFor="Email">Street Address</label>
            <input
              type="email"
              placeholder="Email"
              className="Email"
              id="Email"
            />
          </div>
          <div className="city">
            <div className="input-div">
              <label htmlFor="country-region">Country / Region:</label>
              <select
                style={{ backgroundColor: darkMode ? Colors.darkGray : "" }}
                id="country-region"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value="">Select a country/region</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-div">
              <label htmlFor="state">State:</label>
              <select
                id="state"
                value={selectedState}
                onChange={handleStateChange}
                style={{ backgroundColor: darkMode ? Colors.darkGray : "" }}
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-div">
              <label htmlFor="zip-code"> Zip Code </label>
              <input
                type="text"
                placeholder="Zip Code"
                className="zip-code"
                id="zip-code"
              />
            </div>
          </div>
          <div className="contact">
            <div className="input-div">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                placeholder="Phone"
                className="phone"
                id="phone"
              />
            </div>
            <div className="input-div">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="email"
                id="email"
              />
            </div>
          </div>
          <div className="different-address" style={{ color: Colors.Gray5 }}>
            <FormControlLabel
              control={
                <Checkbox defaultChecked style={{ color: Colors.Primary }} />
              }
              label="Ship to a different address"
            />
          </div>
          <div className="order-notes">
            <h1 className="order-title">Additional Info</h1>
            <p className="order-text">Order Notes (Optional)</p>
            <textarea
              name="order-notes"
              id="order-notes"
              cols={30}
              rows={5}
              placeholder="Notes about your order, e.g. special notes for delivery."
            ></textarea>
          </div>
        </div>
        <div className="order-summary">
          <h1 className="order-title">Order Summary</h1>
          <div>
            <List>
              {cartItems.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </List>
            <div className="subtotal">
              <h2 style={{ color: darkMode ? Colors.Gray4 : Colors.Gray7 }}>
                Subtotal:{" "}
              </h2>
              <h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </h2>
            </div>
            <div className="shipping">
              <h2 style={{ color: darkMode ? Colors.Gray4 : Colors.Gray7 }}>
                Shipping:
              </h2>
              <h2>
                {shippingType === "cash"
                  ? `$${calculateShippingCost().toFixed(2)}`
                  : "Free Shipping"}
              </h2>
            </div>
            <div className="total">
              <h2 style={{ color: darkMode ? Colors.Gray4 : Colors.Gray7 }}>
                Total:
              </h2>
              <h2 className="total-price">
                ${calculateTotalCost().toFixed(2)}
              </h2>
            </div>
          </div>
          <div className="method">
            <h1 style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}>
              Payment Method:
            </h1>
            {paymentOptions.map((option) => (
              <div key={option.value}>
                <label className="payment-label">
                  <input
                    type="radio"
                    value={option.value}
                    checked={selectedPayment === option.value}
                    onChange={handlePaymentChange}
                  />
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          <ButtonShape
            width="100%"
            height="50px"
            backgroundColor={Colors.Primary}
            textColor="white"
          >
            Place Order
          </ButtonShape>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
