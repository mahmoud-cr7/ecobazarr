/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { Checkbox, FormControlLabel } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import "./SignUp.css";
import"../signIn/SignIn.css";
interface SignUpProps {
  // Define your props here
}

const SignUp: React.FC<SignUpProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8; // Example: Password must be at least 8 characters long
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    return confirmPassword === password;
  };

  const handleSubmit = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (!validateConfirmPassword(confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, proceed with form submission
    console.log("Form submitted successfully!");
    // Add your form submission logic here
  };

  return (
    <div className="sign-in container">
      <h1>Sign Up</h1>
      <div className="email-container">
        <input
          type="email"
          name="email"
          className="input email"
          placeholder="Enter your email"
          style={{ color: Colors.Gray4 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          className="input password"
          placeholder="Enter your password"
          style={{ color: Colors.Gray4 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="toggle-password" onClick={togglePasswordVisibility}>
          {showPassword ? (
            <VisibilityOffIcon />
          ) : (
            <RemoveRedEyeIcon style={{ color: Colors.Primary }} />
          )}
        </span>
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          className="input password"
          placeholder="Confirm password"
          style={{ color: Colors.Gray4 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="toggle-password" onClick={togglePasswordVisibility}>
          {showPassword ? (
            <VisibilityOffIcon />
          ) : (
            <RemoveRedEyeIcon style={{ color: Colors.Primary }} />
          )}
        </span>
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}
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
        onClick={handleSubmit}
      >
        Create Account
      </ButtonShape>

      <p style={{ color: Colors.Gray5 }}>
        Already have an account?{" "}
        <a style={{ color: Colors.Gray9 }} href="/signIn">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignUp;
