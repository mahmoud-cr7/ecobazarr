/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import "./Footer.css";
import Colors from "../../utils/Colors";
import ButtonShape from "../button/Button";
import logoPng from "../../assets/logo.png";
import paiment from "../../assets/paiment.png";
import { useNavigate } from "react-router-dom";
interface FooterProps {
  // Define your props here
}
interface FooterList {
  key: number;
  title: string;
  list: { name: string; nav: string }[];
}
const footerList: { [key: string]: FooterList } = {
  MyAccount: {
    key: 1,
    title: "My Account",
    list: [
      { name: "My Account", nav: "/my-account" },
      { name: "Order History ", nav: "/order-history" },
      { name: "Shoping Cart", nav: "/cart" },
      { name: "Wishlist", nav: "/wishlist" },
    ],
  },
  Helps: {
    key: 2,
    title: "Helps",
    list: [
      { name: "Contact", nav: "/ContactUs" },
      { name: "Faqs", nav: "/Faqs" },
      { name: "Terms & Condition", nav: "/terms-condition" },
      { name: "Privacy Policy", nav: "/privacy-policy" },
    ],
  },
  Proxy: {
    key: 3,
    title: "Proxy",
    list: [
      { name: "About Us", nav: "/aboutUs" },
      { name: "Shop", nav: "/Shop" },
      { name: "Product", nav: "/products" },
      { name: "Track Order", nav: "/track-order" },
    ],
  },
  Categories: {
    key: 4,
    title: "Categories",
    list: [
      { name: "Fruit & Vegetables", nav: "/fruit-vegetables" },
      { name: "Meat & Fish", nav: "/meat-fish" },
      { name: "Bread & Bakery", nav: "/bread-bakery" },
      { name: "Beauty & Health", nav: "/beauty-health" },
    ],
  },
};
const Footer: React.FC<FooterProps> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="footer">
        <section className="container">
          <div className="subscribe">
            <div className="subscribe-heading">
              <h2 style={{ color: Colors.Gray6 }}>
                Subscribe to our newsletter
              </h2>
              <p style={{ color: Colors.Gray4 }}>
                Pellentesque eu nibh eget mauris congue mattis mattis nec
                tellus. Phasellus imperdiet elit eu magna.
              </p>
            </div>
            <div className="subscribe-form">
              <div className="subscribe-form-input">
                <input type="email" placeholder="Enter your email" />
                <ButtonShape
                  width="120px"
                  height="58px"
                  textColor={Colors.White}
                  backgroundColor={Colors.Primary}
                >
                  Subscribe
                </ButtonShape>
              </div>
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
          </div>
        </section>
      </div>
      <div className="main-footer" style={{ backgroundColor: Colors.Gray9 }}>
        <section className="container main-footer">
          <div className="footer-heading">
            <div className="footer-logo">
              <img src={logoPng} alt="logo" />
              <h2 style={{ color: Colors.White }}>ECOBAZAR</h2>
            </div>
            <p style={{ color: Colors.Gray4 }} className="footer-description">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis
              dui, eget bibendum magna congue nec.
            </p>
            <div className="contact">
              <p style={{ color: Colors.White }}>(219) 555-0114</p>
              <span style={{ color: Colors.Gray4 }}>or</span>
              <p style={{ color: Colors.White }}>Proxy@gmail.com</p>
            </div>
          </div>
          <div className="footer-list">
            {Object.keys(footerList).map((key) => (
              <div className="list" key={key}>
                <h3 style={{ color: Colors.White }}>{footerList[key].title}</h3>
                <ul>
                  {footerList[key].list.map((item) => (
                    <li
                      key={item.nav}
                      style={{ color: Colors.Gray4 }}
                      onClick={() => {
                        navigate(item.nav);
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="container bottom-footer">
          <div>
            <p style={{ color: Colors.Gray5 }}>
              © 2023 ECOBAZAR. All Rights Reserved
            </p>
          </div>
          <div>
            <img src={paiment} alt="paiment" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Footer;
