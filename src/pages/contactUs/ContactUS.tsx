/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "./ContactUS.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { colors } from "@mui/material";

interface ContactUSProps {
  // Define your props here
}
const containerStyle = {
  // width: "100%",
  height: "400px",
};

const center = {
  lat: 40.7128, // Example: New York City latitude
  lng: -74.006, // Example: New York City longitude
};
const ContactUS: React.FC<ContactUSProps> = (props) => {

    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="container">
      <div className="contact-us">
        <div className="contact-us-info">
          <div className="contact-us-info-header">
            <LocationOnIcon
              className="icon"
              style={{ color: Colors.Primary, fontSize: "50px" }}
            />
            <p>2715 Ash Dr. San Jose, South Dakota 83475</p>
          </div>
          <div className="contact-us-info-header">
            <EmailIcon
              className="icon"
              style={{ color: Colors.Primary, fontSize: "50px" }}
            />
            <p>Proxy@gmail.com</p>
            <p>Help.proxy@gmail.com</p>
          </div>
          <div className="contact-us-info-header">
            <LocalPhoneIcon
              className="icon"
              style={{ color: Colors.Primary, fontSize: "50px" }}
            />
            <p>(219) 555-0114</p>
            <p>(164) 333-0487</p>
          </div>
        </div>
        <div className="contact-us-form">
          <h1>Just Say Hello!</h1>
          <p style={{ color: Colors.Gray6 }}>
            Do you fancy saying hi to me or you want to get started with your
            project and you need my help? Feel free to contact me.
          </p>
          <div className="contact-us-form-input">
            <input
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
              type="text"
              name="name"
              placeholder="Name"
              id=""
            />
            <input
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
              type="email"
              name="email"
              placeholder="Email"
              id=""
            />
          </div>
          <input
            style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
            type="text"
            name=""
            placeholder="Subject"
            id=""
          />
          <textarea
            name="message"
            id=""
            cols={10}
            rows={5}
            placeholder="Message"
            defaultValue={""}
            style={{ color: darkMode ? Colors.Gray1 : Colors.Gray6 }}
          ></textarea>
          <ButtonShape
            width="20%"
            height="50px"
            backgroundColor={Colors.Primary}
            textColor={Colors.White}
          >
            Send Message
          </ButtonShape>
        </div>
      </div>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ContactUS;
