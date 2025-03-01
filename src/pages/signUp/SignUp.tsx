/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import ButtonShape from "../../components/button/Button";
import Colors from "../../utils/Colors";
import { Checkbox, FormControlLabel, Snackbar } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import "./SignUp.css";
import "../signIn/SignIn.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface SignUpProps {
  // Define your props here
  signUp: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ signUp } = { signUp: false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  const handleSubmit = async () => {
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
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted successfully!");
    setErrors({});

    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created:", userCredential.user);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setAuthorized(true);
          setErrMsg("Email already in use");
        } else {
          setErrMsg(error.message);
          setAuthorized(true);
        }
      } else {
        setErrMsg("An unexpected error occurred. Please try again.");
        setAuthorized(true);
      }
    }
  };
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "blue";
      case 4:
        return "green";
      default:
        return "gray";
    }
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={authorized}
        onClose={() => setAuthorized(false)}
        message={errMsg}
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Danger,
          },
        }}
      />
      <div
        style={{
          backgroundColor: darkMode ? Colors.Gray9 : "",
          color: darkMode ? Colors.Gray9 : "",
        }}
        className="sign-in container"
      >
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
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className="input password"
            placeholder="Confirm password"
            style={{ color: Colors.Gray4 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div
            className="password-strength-bar"
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#e0e0e0",
              borderRadius: "5px",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                width: `${(getPasswordStrength(password) / 4) * 100}%`,
                height: "100%",
                backgroundColor: getPasswordStrengthColor(
                  getPasswordStrength(password)
                ),
                borderRadius: "5px",
                transition: "width 0.3s ease-in-out",
              }}
            ></div>
          </div>

          <span
            className="toggle-password"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
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
    </>
  );
};

export default SignUp;
