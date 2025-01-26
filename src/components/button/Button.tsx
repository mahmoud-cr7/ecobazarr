import React from "react";
import { Button } from "@mui/material";
import "./Button.css";
interface ButtonProps {
  width?: string;
  height?: string;
  textColor?: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

const ButtonShape: React.FC<ButtonProps> = ({
  width,
  height,
  textColor,
  backgroundColor,
  children,
}) => {
  return (
    <Button
      className="button-shape"
      sx={{
        width: width,
        height: height,
        color: textColor,
        backgroundColor: backgroundColor,
        borderRadius: "30px",
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonShape;
