/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "./Illustration.css";
import illustration from "../../assets/Illustration.png";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
interface IllustrationProps {
  // Define your props here
}

const Illustration: React.FC<IllustrationProps> = (props) => {
  const navigate = useNavigate();
  return (
    <div className="container illustration">
      <img src={illustration} alt="Illustration" />
      <h1>Oops! page not found</h1>
      <p style={{color: Colors.Gray4}}>
        Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros. Maecenas
        sagittis tortor at metus mollis
      </p>
      <ButtonShape
        width="20%"
        height="48px"
        backgroundColor={Colors.Primary}
        textColor={Colors.White}
        onClick={() => {navigate("/");}}
      >
        Back to Home
      </ButtonShape>
    </div>
  );
};

export default Illustration;
