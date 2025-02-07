import React from "react";
import { Button } from "@mui/material";
import "./Button.css";
interface ButtonProps {
  width?: string;
  height?: string;
  textColor?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const ButtonShape: React.FC<ButtonProps> = ({
  width,
  height,
  textColor,
  backgroundColor,
  children,
  onClick,
  className,
}) => {
  return (
    <Button
      className={`${className} button-shape`}
      sx={{
        width: width,
        height: height,
        color: textColor,
        backgroundColor: backgroundColor,
        borderRadius: "30px",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ButtonShape;
