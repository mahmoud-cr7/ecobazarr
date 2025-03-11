/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import "./aboutUs.css";
import about from "../../assets/about.png";
import AboutBG from "../../assets/AboutBG.png";
import AboutSec from "../../assets/AboutSec.png";
import delivery from "../../assets/delivery.png";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import carIcon from "../../assets/car_icon.png";
import boxIcon from "../../assets/shipping_icon.png";
import shop_icon from "../../assets/shop_icon.png";
import lief from "../../assets/lief.png";
import stars from "../../assets/stars.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface AboutUsProps {
  // Define your props here
}

const AboutUs: React.FC<AboutUsProps> = () => {
  const features = [
    {
      icon: { carIcon },
      title: "100% Organic Food",
      description: "100% healthy & fresh food.",
    },
    {
      icon: { boxIcon },
      title: "Customer Feedback",
      description: "Our happy customer",
    },
    {
      icon: { shop_icon },
      title: "Free Shipping",
      description: "Free shipping with discount",
    },
    {
      icon: { lief },
      title: "Great Support 24/7",
      description: "Instant access to Contact",
    },
    {
      icon: { stars },
      title: "100% Secure Payment",
      description: "We ensure your money is safe",
    },
    {
      icon: { carIcon },
      title: "100% Organic Food",
      description: "100% healthy & fresh food.",
    },
  ];
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <>
      <div className="container">
        <div className="about-section-1">
          <div className="about-text">
            <h1
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
              className="about-title"
            >
              100% Trusted Organic Food Store
            </h1>
            <p
              style={{ color: darkMode ? Colors.Gray6 : Colors.Gray7 }}
              className="about-description"
            >
              Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi,
              laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit.
              Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan.
              Donec a eros non massa vulputate ornare. Vivamus ornare commodo
              ante, at commodo felis congue vitae.
            </p>
          </div>
          <img className="sale-image" src={about} alt="about" />
        </div>
      </div>
      <div className="about-section-2">
        <img className="about-background" src={AboutBG} alt="about" />
        <div className="container">
          <div className="about-container">
            <img className="about-image" src={AboutSec} alt="" />
            <div className="about-content">
              <h1 className="about-title">100% Trusted Organic Food Store</h1>
              <p className="about-description">
                Pellentesque a ante vulputate leo porttitor luctus sed eget
                eros. Nulla et rhoncus neque. Duis non diam eget est luctus
                tincidunt a a mi. Nulla eu eros consequat tortor tincidunt
                feugiat.
              </p>
              <div className="features-container">
                {features.map((feature, index) => (
                  <div className="feature" key={index}>
                    <img
                      className="icon"
                      src={Object.values(feature.icon)[0]}
                      alt={feature.title}
                    />
                    <div className="content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="delivery">
          <div className="delivery-text">
            <h1 style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}>
              We Delivered, You Enjoy Your Order.
            </h1>
            <p style={{ color: darkMode ? Colors.Gray5 : Colors.Gray6 }}>
              Ut suscipit egestas suscipit. Sed posuere pellentesque nunc,
              ultrices consectetur velit dapibus eu. Mauris sollicitudin
              dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor
              bibendum nunc eget elementum.
            </p>
            <ul
              style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              className="delivery-list"
            >
              <li >
                <CheckIcon className="check" />
                Sed in metus pellentesque.
              </li>
              <li >
                <CheckIcon className="check" />
                Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.
              </li>

              <li >
                <CheckIcon className="check" />
                Maecenas ut nunc fringilla erat varius.
              </li>
            </ul>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <img src={delivery} alt="delivery" className="delivery-image" />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
