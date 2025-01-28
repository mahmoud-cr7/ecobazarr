/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import ButtonShape from "../../components/button/Button";
import "./Home.css";
import Colors from "../../utils/Colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import carIcon from "../../assets/car_icon.png";
import shopIcon from "../../assets/shop_icon.png";
import supportIcon from "../../assets/suport_icon.png";
import shippingIcon from "../../assets/shipping_icon.png";
import CardsContainer from "../../components/cards-container/CardsContainer";
import { useQuery } from "@tanstack/react-query";
import Categories from "../../components/categories/Categories";
import { useNavigate } from "react-router-dom";
import Products from "../../components/products/Products";

interface HomeProps {
  // Define your props here
}
const shippingServices = {
  FreeShipping: {
    title: "Free Shipping",
    description: "Free shipping on all order",
    icon: carIcon,
  },
  Support24: {
    title: "Customer Support 24/7",
    description: "Instant access to Support",
    icon: supportIcon,
  },
  SecurePayment: {
    title: "100% Secure Payment",
    description: "We ensure your money is save",
    icon: shopIcon,
  },
  MoneyBack: {
    title: "Money-Back Guarantee",
    description: "30 Days Money-Back Guarantee",
    icon: shippingIcon,
  },
};

const Home: React.FC<HomeProps> = (props) => {
  const [timeLeft, setTimeLeft] = useState(20 * 24 * 60 * 60); // 20 days in seconds
  useEffect(() => {
    if (timeLeft === 0) return; // Stop the timer when it reaches 0

    // Set up the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease timeLeft by 1 every second
    }, 1000);

    // Clean up the timer when the component unmounts or timeLeft reaches 0
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (time :number) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);
  const navigate = useNavigate();

  return (
    <>
      <div className="home container">
        <div className="banner">
          <div className="content">
            <h1 style={{ color: Colors.White }}>
              Fresh & Healthy Organic Food
            </h1>
            <div className="sale-info" style={{ color: Colors.White }}>
              <p className="sale-text">
                Sale up to{" "}
                <span style={{ backgroundColor: Colors.Warning }}>30% OFF</span>
              </p>
              <p>Free shipping on all your order.</p>
            </div>
          </div>
          <ButtonShape
            width="200px"
            height="50px"
            backgroundColor={Colors.White}
            textColor={Colors.Primary}
          >
            Shop Now <ArrowForwardIcon />
          </ButtonShape>
        </div>
        <div className="side-container">
          <div className="sale">
            <p style={{ color: Colors.Gray9 }}>Summer Sale</p>
            <h1 style={{ color: Colors.Primary }}>75% OFF</h1>
            <p style={{ color: Colors.Gray6 }}>Only Fruit & Vegetable</p>
            <ButtonShape height="50px" textColor={Colors.Primary}>
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="deal">
            <p style={{ color: Colors.White }}>Best Deal</p>
            <h1>Special Products Deal of the Month</h1>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.White}
              textColor={Colors.Primary}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="services ">
          {Object.keys(shippingServices).map((key) => {
            const service =
              shippingServices[key as keyof typeof shippingServices];
            return (
              <div className="service" key={key}>
                <img src={service.icon} alt={key} />
                <div>
                  <h3>{service.title}</h3>
                  <p style={{ color: Colors.Gray6 }}>{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container">
        <CardsContainer
          header="Popular Categories"
          onClick={() => {
            navigate("/categories");
          }}
        >
          <Categories />
        </CardsContainer>
      </div>
      <div className="container">
        <CardsContainer
          header="Popular Products"
          onClick={() => {
            navigate("/products");
          }}
        >
          <Products />
        </CardsContainer>
      </div>
      <div className="container">
        <div className="offers">
          <div className="sale sale-1">
            <p style={{ color: Colors.Gray9 }}>Best Deals</p>
            <h1>Sale of the Month</h1>
            <div>
              <div className="countdown-timer">
                <div className="time-section">
                  <span className="time-value">{days}</span>
                  <span className="time-label">DAYS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{hours}</span>
                  <span className="time-label">HOURS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{minutes}</span>
                  <span className="time-label">MINS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{seconds}</span>
                  <span className="time-label">SECS</span>
                </div>
              </div>
            </div>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="sale sale-2">
            <p style={{ color: Colors.White }}>85% Fat Free</p>
            <h1 style={{ color: Colors.White }}>Low-Fat Meat</h1>
            <p style={{ color: Colors.White }}>
              Started at <span style={{ color: Colors.Warning }}>$79.99</span>
            </p>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.White}
              textColor={Colors.Primary}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="sale sale-3">
            <p style={{ color: Colors.White }}>Summer Sale</p>
            <h1>100% Fresh Fruit</h1>
            <p>
              Up to
              <span style={{ color: Colors.Warning }} className="sale-span">
                {" "}
                64% OFF
              </span>
            </p>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
