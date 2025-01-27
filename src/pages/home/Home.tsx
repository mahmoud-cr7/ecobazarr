/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import ButtonShape from "../../components/button/Button";
import "./Home.css";
import Colors from "../../utils/Colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import carIcon from "../../assets/car_icon.png";
import shopIcon from "../../assets/shop_icon.png";
import supportIcon from "../../assets/suport_icon.png";
import shippingIcon from "../../assets/shipping_icon.png";
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
    </>
  );
};

export default Home;
