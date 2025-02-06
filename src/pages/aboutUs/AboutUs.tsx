/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import "./aboutUs.css";
import about from "../../assets/about.png";

interface AboutUsProps {
  // Define your props here
}

const AboutUs: React.FC<AboutUsProps> = (props) => {
  return (
    <div className="container">
      <div>
        <div>
          <h1>100% Trusted Organic Food Store</h1>
          <p>
            Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi,
            laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit.
            Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec
            a eros non massa vulputate ornare. Vivamus ornare commodo ante, at
            commodo felis congue vitae.
          </p>
        </div>
        <img src={about} alt="about" />
      </div>
    </div>
  );
};

export default AboutUs;
