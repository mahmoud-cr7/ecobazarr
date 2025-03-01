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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/Firebase";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// import Snackbar from "@mui/joy/Snackbar";

interface SignInProps {
  // Define your props here
  signUp: boolean;
}

const SignIn: React.FC<SignInProps> = ({ signUp } = { signUp: false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const navigate = useNavigate();

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

  const handleSubmit = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, proceed with form submission
    console.log("Form submitted successfully!");
    setErrors({});
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        navigate("/");
        setSignUpSuccess(true);
        setSignUpSuccess(signUp);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage("Invalid email or password");
      });

    // Add your form submission logic here
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
        open={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem", // Increase font size
            padding: "20px", // Increase padding
            minWidth: "400px", // Set minimum width
            backgroundColor: Colors.Danger, // Change background color
          },
        }}
      />
      <div
      style={{
        backgroundColor: darkMode ? Colors.Gray9 :"",
        color: darkMode ? Colors.Gray9 : ""}}
      className="sign-in container">
        <h1>Sign In</h1>
        <div className="email-container">
          <input
            type="email"
            name="email"
            className="input"
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
          onClick={handleSubmit}
        >
          Login
        </ButtonShape>

        <p style={{ color: Colors.Gray5 }}>
          Don't have an account?{" "}
          <a style={{ color: Colors.Gray9 }} href="/signUp">
            Register
          </a>
        </p>
      </div>
    </>
  );
};

export default SignIn;
