/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "./profile.css";
import Colors from "../../utils/Colors";
import ButtonShape from "../../components/button/Button";
import { app } from "../../firebase/Firebase";
import avatarPng from "../../assets/avatar.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Snackbar, ToggleButton } from "@mui/material";
import Wishlist from "../../pages/wishlist/Wishlist";
import Cart from "../cart/Cart";
import { DarkMode, LightMode } from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { toggleDarkMode } from "../../store/themeSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface ProfileProps {
  // Define your props here
}

const orders = [
  {
    order_id: "#3933",
    date: "4 April, 2021",
    total: "$135.00",
    products: 5,
    status: "Processing",
  },
  {
    order_id: "#5045",
    date: "27 Mar, 2021",
    total: "$25.00",
    products: 1,
    status: "On the way",
  },
  {
    order_id: "#5028",
    date: "20 Mar, 2021",
    total: "$250.00",
    products: 4,
    status: "Completed",
  },
  {
    order_id: "#4800",
    date: "19 Mar, 2021",
    total: "$35.00",
    products: 1,
    status: "Completed",
  },
  {
    order_id: "#4152",
    date: "18 Mar, 2021",
    total: "$578.00",
    products: 13,
    status: "Completed",
  },
  {
    order_id: "#8811",
    date: "10 Mar, 2021",
    total: "$345.00",
    products: 7,
    status: "Completed",
  },
  {
    order_id: "#3536",
    date: "5 Mar, 2021",
    total: "$560.00",
    products: 2,
    status: "Completed",
  },
  {
    order_id: "#1374",
    date: "27 Feb, 2021",
    total: "$560.00",
    products: 2,
    status: "Completed",
  },
  {
    order_id: "#7791",
    date: "25 Feb, 2021",
    total: "$560.00",
    products: 2,
    status: "Completed",
  },
  {
    order_id: "#4846",
    date: "24 Feb, 2021",
    total: "$23.00",
    products: 1,
    status: "Completed",
  },
  {
    order_id: "#5948",
    date: "20 Feb, 2021",
    total: "$23.00",
    products: 1,
    status: "Completed",
  },
  {
    order_id: "#1577",
    date: "12 Oct, 2020",
    total: "$23.00",
    products: 1,
    status: "Completed",
  },
];

const Profile: React.FC<ProfileProps> = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);
  const [, setAvatar] = useState(avatarPng);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({ email: user.email || "", uid: user.uid });
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFormData(userSnap.data() as typeof formData);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !user) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecobazar"); // Ensure this exists in Cloudinary settings
    formData.append("folder", "profile_pictures"); // Optional: Organize uploads

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dnjdiiktw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Cloudinary Response:", data); // Debugging

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      const imageUrl = data.secure_url;
      setAvatar(imageUrl);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));

      // Save URL to Firestore
      const db = getFirestore(app);
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { avatar: imageUrl }, { merge: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleLanguage = () => setSelected(!selected);

  const validate = () => {
    let valid = true;
    const newErrors = { firstName: "", lastName: "", phone: "" };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
    //    if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone)) {
    //      newErrors.phone = "Valid phone number is required";
    //      valid = false;
    //    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;

    const db = getFirestore(app);
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user.email,
        phone: formData.phone,
        avatar: formData.avatar,
      });
      setSaved(true);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={saved}
        onClose={() => setSaved(false)}
        autoHideDuration={1000}
        message="Profile updated successfully"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Primary,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <div className="container">
        <div className="profile">
          <div className="navigation">
            <h1>Navigation</h1>
            <ul>
              <li
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
                onClick={() => setSelectedTab(0)}
                className={selectedTab === 0 ? "active-tab" : ""}
              >
                <DashboardIcon
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                  className="icon"
                />
                Dashboard
              </li>
              <li
                onClick={() => setSelectedTab(1)}
                className={selectedTab === 1 ? "active-tab" : ""}
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              >
                <HistoryIcon
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                  className="icon"
                />
                My Orders
              </li>
              <li
                onClick={() => setSelectedTab(2)}
                className={selectedTab === 2 ? "active-tab" : ""}
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              >
                <FavoriteBorderIcon
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                  className="icon"
                />
                My Wishlist
              </li>
              <li
                onClick={() => setSelectedTab(3)}
                className={selectedTab === 3 ? "active-tab" : ""}
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              >
                <ShoppingBagIcon
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                  className="icon"
                />
                Shopping Cart
              </li>
              <li
                onClick={() => setSelectedTab(4)}
                className={selectedTab === 4 ? "active-tab" : ""}
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              >
                <SettingsIcon
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                  className="icon"
                />
                Settings
              </li>
              <li
                onClick={() => setSelectedTab(5)}
                className={selectedTab === 5 ? "active-tab" : ""}
                style={{ color: darkMode ? Colors.Gray6 : Colors.Gray6 }}
              >
                <LogoutIcon
                  className="icon"
                  style={{ color: darkMode ? Colors.Gray2 : Colors.Gray2 }}
                />
                Log-out
              </li>
            </ul>
          </div>
          <div className="acount-content">
            {selectedTab === 0 && (
              <>
                <div>
                  <div className="dashboard">
                    <div className="user-data">
                      <img
                        src={formData.avatar || avatarPng}
                        alt="Avatar"
                        className="avatar-img"
                      />
                      <h1>{formData.firstName + " " + formData.lastName}</h1>
                      <p style={{ color: Colors.Gray5 }}>Customer </p>
                      <p
                        style={{ color: Colors.Primary }}
                        onClick={() => setSelectedTab(4)}
                        className="edit-profile"
                      >
                        Edit Profile
                      </p>
                    </div>
                    <div className="user-address">
                      <p>Shipping Address</p>
                    </div>
                  </div>
                  <div>
                    <div className="orders-container">
                      <div className="orders-header">
                        <p>Recet Order History</p>
                        <p
                          style={{ color: Colors.Primary }}
                          onClick={() => setSelectedTab(1)}
                          className="view-all"
                        >
                          View All
                        </p>
                      </div>
                      {orders.length > 0 ? (
                        <table className="orders-table">
                          <thead>
                            <tr>
                              <th
                                className="order-table-header"
                                style={{
                                  color: darkMode ? Colors.Gray6 : Colors.Gray6,
                                }}
                              >
                                Order ID
                              </th>
                              <th
                                style={{
                                  color: darkMode ? Colors.Gray6 : Colors.Gray6,
                                }}
                                className="order-table-header"
                              >
                                Date
                              </th>
                              <th
                                style={{
                                  color: darkMode ? Colors.Gray6 : Colors.Gray6,
                                }}
                                className="order-table-header"
                              >
                                Total
                              </th>
                              <th
                                style={{
                                  color: darkMode ? Colors.Gray6 : Colors.Gray6,
                                }}
                                className="order-table-header"
                              >
                                Status
                              </th>
                              <th
                                style={{
                                  color: darkMode ? Colors.Gray6 : Colors.Gray6,
                                }}
                                className="order-table-header"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((order) => (
                              <tr key={order.order_id} className="table-row">
                                <td className="table-cell">{order.order_id}</td>
                                <td className="table-cell">{order.date}</td>
                                <td className="table-cell">
                                  {order.total} ({order.products} Products)
                                </td>
                                <td
                                  className={`table-cell status-${order.status
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {order.status}
                                </td>
                                <td className="table-cell">
                                  <a
                                    href="#"
                                    className="view-details"
                                    style={{ color: Colors.Primary }}
                                  >
                                    View Details
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="no-orders">No orders found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedTab === 1 && (
              <>
                <div className="orders-container">
                  {orders.length > 0 ? (
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: darkMode ? Colors.Gray6 : Colors.Gray6,
                            }}
                            className="order-table-header"
                          >
                            Order ID
                          </th>
                          <th
                            style={{
                              color: darkMode ? Colors.Gray6 : Colors.Gray6,
                            }}
                            className="order-table-header"
                          >
                            Date
                          </th>
                          <th
                            style={{
                              color: darkMode ? Colors.Gray6 : Colors.Gray6,
                            }}
                            className="order-table-header"
                          >
                            Total
                          </th>
                          <th
                            style={{
                              color: darkMode ? Colors.Gray6 : Colors.Gray6,
                            }}
                            className="order-table-header"
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: darkMode ? Colors.Gray6 : Colors.Gray6,
                            }}
                            className="order-table-header"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.order_id} className="table-row">
                            <td className="table-cell">{order.order_id}</td>
                            <td className="table-cell">{order.date}</td>
                            <td className="table-cell">
                              {order.total} ({order.products} Products)
                            </td>
                            <td
                              className={`table-cell status-${order.status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {order.status}
                            </td>
                            <td className="table-cell">
                              <a
                                href="#"
                                className="view-details"
                                style={{ color: Colors.Primary }}
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-orders">No orders found.</p>
                  )}
                </div>
              </>
            )}
            {selectedTab === 2 && (
              <>
                <Wishlist
                  id={""}
                  name={""}
                  imageUrl={""}
                  price={0}
                  quantity={0}
                  className=""
                />
              </>
            )}
            {selectedTab === 3 && (
              <>
                <Cart className="" />
              </>
            )}
            {selectedTab === 4 && (
              <>
                <h1
                  style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
                  className="title"
                >
                  Account Settings
                </h1>
                <div className="account-settings">
                  <div className="form">
                    <div className="input-group">
                      <label className="label">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <span className="error">{errors.firstName}</span>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="label">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <span className="error">{errors.lastName}</span>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        style={{
                          backgroundColor: darkMode
                            ? Colors.Gray6
                            : Colors.Gray1,
                          color: darkMode ? Colors.Gray1 : Colors.Gray9,
                        }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Phone"
                      />
                      {errors.phone && (
                        <span className="error">{errors.phone}</span>
                      )}
                    </div>
                    <ButtonShape
                      width="200px"
                      height="40px"
                      textColor={Colors.White}
                      backgroundColor={Colors.Primary}
                      onClick={handleSave}
                    >
                      Save Changes
                    </ButtonShape>
                  </div>
                  <div className="image">
                    <img
                      src={formData.avatar || avatarPng}
                      alt=""
                      className="edit-avatar"
                    />
                    <ButtonShape
                      width="200px"
                      height="40px"
                      textColor={Colors.White}
                      backgroundColor={Colors.Primary}
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      Choose Image
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </ButtonShape>
                  </div>
                </div>
                <div className="account-content">
                  <div className="icons-section account-icons">
                    <div className="dark-mode-icon">
                      <p>Dark Mode</p>
                      <ToggleButton
                        value="theme"
                        selected={darkMode}
                        className="toggle-button"
                        onClick={() => {
                          try {
                            dispatch(toggleDarkMode());
                          } catch (error) {
                            console.error("Error toggling dark mode:", error);
                          }
                        }}
                        style={{ backgroundColor: Colors.Primary }}
                      >
                        {darkMode ? (
                          <DarkMode style={{ color: Colors.White }} className="dark-mode-icon" />
                        ) : (
                          <LightMode style={{ color: Colors.White }} />
                        )}
                      </ToggleButton>
                    </div>
                    <div className="language-icon-section">
                      <p>Language</p>
                      <div
                        className="language-icon"
                        style={{
                          color: Colors.White,
                          backgroundColor: Colors.Primary,
                        }}
                        onClick={handleLanguage}
                      >
                        <LanguageIcon />
                        <ArrowDropDownIcon />
                        {selected && (
                          <div className="language-dropdown">
                            <p style={{ color: Colors.Primary }}>English</p>
                            <p style={{ color: Colors.Primary }}>العربية</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
