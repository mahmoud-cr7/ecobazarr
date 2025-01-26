/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import ButtonShape from "../../components/button/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./SignIn.css";
import Colors from "../../utils/Colors";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
interface SignInProps {
  // Define your props here
}

const SignIn: React.FC<SignInProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="sign-in container">
      <h1>Sign In</h1>
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
          style={{

          }}
        >
          {showPassword ? <VisibilityOffIcon  /> : <RemoveRedEyeIcon style={{ color: Colors.Primary }} />}
        </span>
      </div>
      <div className="remember-me" style={{ color: Colors.Gray5 }}>
        <FormControlLabel
          control={
            <Checkbox defaultChecked style={{ color: Colors.Primary }} />
          }
          label="Remember me"
        />
        <a href="/signIn">Forgot Password?</a>
      </div>
      <ButtonShape
        width="100%"
        height="40px"
        backgroundColor={Colors.Primary}
        textColor="#fff"
      >
        Login
      </ButtonShape>

      <p style={{ color: Colors.Gray5 }}>
        Don't have an account?{" "}
        <a style={{ color: Colors.Gray9 }} href="/signUp">
          {" "}
          Register
        </a>
      </p>
    </div>
  );
};

export default SignIn;
