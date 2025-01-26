/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { Checkbox, FormControlLabel } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./SignUp.css";

interface signUpProps {
  // Define your props here
}

const SignUp: React.FC<signUpProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="sign-in container">
      <h1>Sign Up</h1>
      <input
        type="email"
        name="email"
        id=""
        className="input"
        placeholder="Enter your email"
        style={{ color: Colors.Gray4 }}
      />
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id=""
          className="input password"
          placeholder="Enter your password"
          style={{ color: Colors.Gray4 }}
        />
        <span
          className="toggle-password"
          onClick={togglePasswordVisibility}
          style={{}}
        >
          {showPassword ? (
            <VisibilityOffIcon />
          ) : (
            <RemoveRedEyeIcon style={{ color: Colors.Primary }} />
          )}
        </span>
      </div>
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id=""
          className="input password"
          placeholder="Confirm password"
          style={{ color: Colors.Gray4 }}
        />
        <span
          className="toggle-password"
          onClick={togglePasswordVisibility}
          style={{}}
        >
          {showPassword ? (
            <VisibilityOffIcon />
          ) : (
            <RemoveRedEyeIcon style={{ color: Colors.Primary }} />
          )}
        </span>
      </div>
      <div className="remember-me" style={{ color: Colors.Gray5 }}>
        <FormControlLabel
          control={
            <Checkbox defaultChecked style={{ color: Colors.Primary }} />
          }
          label="Accept all terms & Conditions"
        />
      </div>
      <ButtonShape
        width="100%"
        height="40px"
        backgroundColor={Colors.Primary}
        textColor="#fff"
      >
        Create Account
      </ButtonShape>

      <p style={{ color: Colors.Gray5 }}>
        Already have account{" "}
        <a style={{ color: Colors.Gray9 }} href="/signIn">
          {" "}
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignUp;
