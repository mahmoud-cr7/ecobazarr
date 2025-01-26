/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import logoPng from "../../assets/logo.png";
import "./NavBar.css";
import { Button } from "@mui/material";
import Colors from "../../utils/Colors";
import { Link } from "react-router-dom";
import TemporaryDrawer from "../drawer/Drawer";
interface NavBarProps {
  // Define your props here
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="navbar">
      <section className=" top">
        <div className="container section">
          <div className="location" style={{ color: Colors.Gray6 }}>
            <AddLocationIcon className="icon" />
            Store Location: Lincoln- 344, Illinois, Chicago, USA
          </div>
          <div className="login" style={{ color: Colors.Gray6 }}>
            <Button
              component={Link}
              to="/signIn"
              variant="text"
              style={{ color: Colors.Gray6 }}
            >
              Sign In
            </Button>
            /
            <Button
              component={Link}
              to="/signUp"
              variant="text"
              style={{ color: Colors.Gray6 }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>
      <section className=" mid ">
        <div className="container section">
          <div className="logo">
            <img src={logoPng} alt="logoPng" />
            ECOBAZAR
          </div>
          <div className="search">
            <SearchIcon
              className="search-icon"
              style={{
                color: Colors.Gray6,
              }}
            />
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              style={{
                border: `1px solid ${Colors.Gray1}`,
              }}
            />
            <Button
              variant="contained"
              className="search-button"
              style={{
                backgroundColor: Colors.Primary,
              }}
            >
              Search
            </Button>
          </div>
          <div
            className="icons"
            style={{
              color: Colors.Gray6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FavoriteBorderIcon className="icon" />|
            <div
              className="shop-icon"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <ShoppingBagIcon className="icon" />
            </div>
          </div>
        </div>
      </section>
      <section className="" style={{ backgroundColor: Colors.Gray8 }}>
        <div className=" bottom container">
          <Button
            component={Link}
            to="/"
            className="button"
            style={{ color: Colors.White }}
          >
            Home
          </Button>
          <div className="dropdown">
            <button
              onClick={() => {
                setIsShopOpen(!isShopOpen);
                setIsPagesOpen(false);
              }}
            >
              Shop
              <ArrowDropDownIcon />
            </button>
            {isShopOpen && (
              <div
                className="dropdown-content"
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <a href="#">Option 1</a>
                <a href="#">Option 2</a>
                <a href="#">Option 3</a>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              onClick={() => {
                setIsPagesOpen(!isPagesOpen);
                setIsShopOpen(false);
              }}
            >
              Pages
              <ArrowDropDownIcon />
            </button>
            {isPagesOpen && (
              <div
                className="dropdown-content"
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <a href="#">Option 1</a>
                <a href="#">Option 2</a>
                <a href="#">Option 3</a>
              </div>
            )}
          </div>
          <Button className="button">Blog</Button>
          <Button className="button">About Us</Button>
          <Button className="button">Contact Us</Button>
        </div>
      </section>
      <TemporaryDrawer open={open} setOpen={setOpen} />
    </div>
  );
};

export default NavBar;
